"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const child_process_1 = require("child_process");
const clone_1 = __importDefault(require("clone"));
const fs_extra_1 = require("fs-extra");
const promises_1 = require("fs/promises");
const lodash_1 = require("lodash");
const path_1 = require("path");
const process_1 = require("process");
const util_1 = require("util");
const find_exe_1 = __importDefault(require("./find-exe"));
const exec = (0, util_1.promisify)(child_process_1.exec);
class AudioNormaliser {
    constructor(nodecg, assetName = 'videos') {
        this.nodecg = nodecg;
        this.assets = nodecg.Replicant(`assets:${assetName}`);
        this.assetsNormalised = nodecg.Replicant(`assets:${assetName}-normalised`, // Stores assets already normalised for reference
        { defaultValue: [] });
        this.setup();
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            // Stop running and print an error if any executables aren't available in PATH.
            const exeMissing = [];
            if (!(yield (0, find_exe_1.default)('python')))
                exeMissing.push('python');
            if (!(yield (0, find_exe_1.default)('ffmpeg')))
                exeMissing.push('ffmpeg');
            if (!(yield (0, find_exe_1.default)('ffmpeg-normalize')))
                exeMissing.push('ffmpeg-normalize');
            if (exeMissing.length) {
                this.nodecg.log.warn('[Audio Normaliser] %s must be installed and available in PATH, will not run!', exeMissing.join(', '));
                return;
            }
            // Used if no files are found in the assets folder on start up, which doesn't trigger
            // the listener below correctly.
            const noFilesTO = setTimeout(() => {
                // Removed assets need removing from "already normalised" array.
                const removed = (0, lodash_1.differenceBy)(this.assetsNormalised.value, this.assets.value, 'sum');
                for (const asset of removed) {
                    const index = this.assetsNormalised.value.findIndex((a) => a.sum === asset.sum);
                    if (index >= 0)
                        this.assetsNormalised.value.splice(index, 1);
                }
            }, 10 * 1000);
            // Stores names of files being processed, for easy reference between parts of code.
            const processing = [];
            this.assets.on('change', (newVal, oldVal) => __awaiter(this, void 0, void 0, function* () {
                if (!oldVal && !newVal.length)
                    return; // Happens on start up, completely empty
                if (!(0, lodash_1.differenceBy)(newVal, oldVal || [], 'sum').length
                    && !(0, lodash_1.differenceBy)(oldVal, newVal, 'sum').length) {
                    return; // Sometimes this listener is triggered with no actual changes
                }
                clearTimeout(noFilesTO);
                const added = (0, lodash_1.differenceBy)(newVal, this.assetsNormalised.value, 'sum');
                const removed = (0, lodash_1.differenceBy)(this.assetsNormalised.value, newVal, 'sum');
                // Runs through any newly added assets that are currently processing,
                // which should mean this is the fully processed file and we were successful.
                for (const asset of added) {
                    if (processing.includes(asset.name)
                        && !this.assetsNormalised.value.find((a) => a.sum === asset.sum)) {
                        this.assetsNormalised.value.push((0, clone_1.default)(asset));
                        processing.splice(processing.indexOf(asset.name), 1);
                    }
                }
                // Removed assets need removing from "already normalised" array.
                for (const asset of removed) {
                    const index = this.assetsNormalised.value.findIndex((a) => a.sum === asset.sum);
                    if (index >= 0)
                        this.assetsNormalised.value.splice(index, 1);
                }
                // Runs through any newly added assets that haven't been seen before at all.
                // This copies them to a temp folder, then normalises them back in the original location.
                for (const [i, asset] of added.entries()) {
                    if (!processing.includes(asset.name)
                        && !this.assetsNormalised.value.find((a) => a.sum === asset.sum)) {
                        const original = this.getAssetLocation(asset);
                        processing.push(asset.name);
                        // Small wait before processing first element only.
                        if (i === 0)
                            yield new Promise((res) => { setTimeout(res, 2000); });
                        try {
                            const tempDir = (0, path_1.join)(this.getAssetDir(asset), 'temp');
                            const tempCopy = (0, path_1.join)(tempDir, asset.name);
                            yield (0, fs_extra_1.ensureDir)(tempDir); // Ensures temp directory exists
                            yield (0, fs_extra_1.copyFile)(original, tempCopy); // Copy to temp
                            yield (0, promises_1.unlink)(original); // Delete original
                            // Executes the ffmpeg-normalize command.
                            const cmd = [
                                'ffmpeg-normalize',
                                `"${tempCopy}"`,
                                '-c:a aac',
                                `-o "${this.getAssetLocation(asset, true)}"`, // Also makes ext lowercase
                            ].join(' ');
                            yield exec(cmd);
                            yield (0, promises_1.unlink)(tempCopy); // Delete temp
                        }
                        catch (err) {
                            this.nodecg.log.warn('[Audio Normaliser] Error processing %s', original);
                            this.nodecg.log.warn('[Audio Normaliser] Error processing %s:', original, err);
                        }
                    }
                }
            }));
        });
    }
    getAssetDir(asset) {
        return (0, path_1.join)((0, process_1.cwd)(), `assets/${asset.namespace}/${asset.category}`);
    }
    getAssetLocation(asset, lowercaseExt = false) {
        const ext = lowercaseExt ? asset.ext.toLowerCase() : asset.ext;
        return (0, path_1.join)((0, process_1.cwd)(), `assets/${asset.namespace}/${asset.category}/${asset.name}${ext}`);
    }
}
module.exports = AudioNormaliser;
