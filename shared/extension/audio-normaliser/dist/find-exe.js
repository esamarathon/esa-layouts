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
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
/**
 * Adapted from a script sourced from:
 * https://abdus.dev/posts/checking-executable-exists-in-path-using-node/
 */
function checkFileExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield promises_1.default.stat(filePath)).isFile()) {
            return filePath;
        }
        throw new Error('Not a file');
    });
}
/**
 * @param {string} exe executable name (without extension if on Windows)
 * @return {Promise<string|null>} executable path if found
 * */
function findExecutable(exe) {
    return __awaiter(this, void 0, void 0, function* () {
        const envPath = process.env.PATH || '';
        const envExt = process.env.PATHEXT || '';
        const pathDirs = envPath
            .replace(/["]+/g, '')
            .split(path_1.default.delimiter)
            .filter(Boolean);
        const extensions = envExt.split(';');
        const candidates = pathDirs.flatMap((d) => extensions.map((ext) => path_1.default.join(d, exe + ext)));
        try {
            return yield Promise.any(candidates.map(checkFileExists));
        }
        catch (e) {
            return null;
        }
    });
}
exports.default = findExecutable;
