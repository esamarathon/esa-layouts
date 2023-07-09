import type NodeCGTypes from '@nodecg/types';
import NodeCG from '@nodecg/types';
import { exec as execCb } from 'child_process';
import clone from 'clone';
import { copyFile, ensureDir } from 'fs-extra';
import { unlink } from 'fs/promises';
import { differenceBy } from 'lodash';
import { join } from 'path';
import { cwd } from 'process';
import { promisify } from 'util';
import findExecutable from './find-exe';

const exec = promisify(execCb);

class AudioNormaliser {
  nodecg!: NodeCGTypes.ServerAPI;
  assets!: NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCG.AssetFile[]>;
  assetsNormalised!: NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCG.AssetFile[]>;

  constructor(nodecg: NodeCGTypes.ServerAPI, assetName = 'videos') {
    this.nodecg = nodecg;
    this.assets = nodecg.Replicant<NodeCG.AssetFile[]>(
      `assets:${assetName}`,
    ) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCG.AssetFile[]>;
    this.assetsNormalised = nodecg.Replicant<NodeCG.AssetFile[]>(
      `assets:${assetName}-normalised`, // Stores assets already normalised for reference
      { defaultValue: [] },
    ) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCG.AssetFile[]>;
    this.setup();
  }

  private async setup(): Promise<void> {
    // Stop running and print an error if any executables aren't available in PATH.
    const exeMissing: string[] = [];
    if (!await findExecutable('python')) exeMissing.push('python');
    if (!await findExecutable('ffmpeg')) exeMissing.push('ffmpeg');
    if (!await findExecutable('ffmpeg-normalize')) exeMissing.push('ffmpeg-normalize');
    if (exeMissing.length) {
      this.nodecg.log.warn(
        '[Audio Normaliser] %s must be installed and available in PATH, will not run!',
        exeMissing.join(', '),
      );
      return;
    }

    // Used if no files are found in the assets folder on start up, which doesn't trigger
    // the listener below correctly.
    const noFilesTO = setTimeout(() => {
      // Removed assets need removing from "already normalised" array.
      const removed = differenceBy(this.assetsNormalised.value, this.assets.value, 'sum');
      for (const asset of removed) {
        const index = this.assetsNormalised.value.findIndex((a) => a.sum === asset.sum);
        if (index >= 0) this.assetsNormalised.value.splice(index, 1);
      }
    }, 10 * 1000);

    // Stores names of files being processed, for easy reference between parts of code.
    const processing: string[] = [];
    this.assets.on('change', async (newVal, oldVal) => {
      if (!oldVal && !newVal.length) return; // Happens on start up, completely empty
      if (!differenceBy(newVal, oldVal || [], 'sum').length
      && !differenceBy(oldVal, newVal, 'sum').length) {
        return; // Sometimes this listener is triggered with no actual changes
      }
      clearTimeout(noFilesTO);
      const added = differenceBy(newVal, this.assetsNormalised.value, 'sum');
      const removed = differenceBy(this.assetsNormalised.value, newVal, 'sum');

      // Runs through any newly added assets that are currently processing,
      // which should mean this is the fully processed file and we were successful.
      for (const asset of added) {
        if (processing.includes(asset.name)
        && !this.assetsNormalised.value.find((a) => a.sum === asset.sum)) {
          this.assetsNormalised.value.push(clone(asset));
          processing.splice(processing.indexOf(asset.name), 1);
        }
      }

      // Removed assets need removing from "already normalised" array.
      for (const asset of removed) {
        const index = this.assetsNormalised.value.findIndex((a) => a.sum === asset.sum);
        if (index >= 0) this.assetsNormalised.value.splice(index, 1);
      }

      // Runs through any newly added assets that haven't been seen before at all.
      // This copies them to a temp folder, then normalises them back in the original location.
      for (const [i, asset] of added.entries()) {
        if (!processing.includes(asset.name)
        && !this.assetsNormalised.value.find((a) => a.sum === asset.sum)) {
          const original = this.getAssetLocation(asset);
          processing.push(asset.name);
          // Small wait before processing first element only.
          if (i === 0) await new Promise((res) => { setTimeout(res, 2000); });
          try {
            const tempDir = join(this.getAssetDir(asset), 'temp');
            const tempCopy = join(tempDir, asset.name);
            await ensureDir(tempDir); // Ensures temp directory exists
            await copyFile(original, tempCopy); // Copy to temp
            await unlink(original); // Delete original

            // Executes the ffmpeg-normalize command.
            const cmd = [
              'ffmpeg-normalize',
              `"${tempCopy}"`,
              '-c:a aac',
              `-o "${this.getAssetLocation(asset, true)}"`, // Also makes ext lowercase
            ].join(' ');
            await exec(cmd);

            await unlink(tempCopy); // Delete temp
          } catch (err) {
            this.nodecg.log.warn('[Audio Normaliser] Error processing %s', original);
            this.nodecg.log.warn('[Audio Normaliser] Error processing %s:', original, err);
          }
        }
      }
    });
  }

  private getAssetDir(asset: NodeCGTypes.AssetFile): string {
    return join(cwd(), `assets/${asset.namespace}/${asset.category}`);
  }

  private getAssetLocation(asset: NodeCGTypes.AssetFile, lowercaseExt = false): string {
    const ext = lowercaseExt ? asset.ext.toLowerCase() : asset.ext;
    return join(cwd(), `assets/${asset.namespace}/${asset.category}/${asset.name}${ext}`);
  }
}

export = AudioNormaliser;
