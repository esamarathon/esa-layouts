import fs from 'fs/promises';
import path from 'path';

/**
 * Adapted from a script sourced from:
 * https://abdus.dev/posts/checking-executable-exists-in-path-using-node/
 */

async function checkFileExists(filePath: string) {
  if ((await fs.stat(filePath)).isFile()) {
    return filePath;
  }
  throw new Error('Not a file');
}

/**
 * @param {string} exe executable name (without extension if on Windows)
 * @return {Promise<string|null>} executable path if found
 * */
async function findExecutable(exe: string): Promise<string | null> {
  const envPath = process.env.PATH || '';
  const envExt = process.env.PATHEXT || '';
  const pathDirs = envPath
    .replace(/["]+/g, '')
    .split(path.delimiter)
    .filter(Boolean);
  const extensions = envExt.split(';');
  const candidates = pathDirs.flatMap((d) => extensions.map((ext) => path.join(d, exe + ext)));
  try {
    return await Promise.any(candidates.map(checkFileExists));
  } catch (e) {
    return null;
  }
}

export default findExecutable;
