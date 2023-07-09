"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUSD = exports.formatSrcomPronouns = exports.logError = exports.getOtherStreamEventShort = exports.getCurrentEventShort = exports.wait = exports.padTimeNumber = void 0;
const util_1 = __importDefault(require("util"));
const nodecg_1 = require("./nodecg");
const config = (0, nodecg_1.get)().bundleConfig;
/**
 * Checks if number needs a 0 adding to the start and does so if needed.
 * @param num Number which you want to turn into a padded string.
 */
function padTimeNumber(num) {
    return num.toString().padStart(2, '0');
}
exports.padTimeNumber = padTimeNumber;
/**
 * Generates a promise that waits the length (in milliseconds) supplied.
 * @param length Length to wait in milliseconds
 * @returns A promise.
 */
async function wait(length) {
    return new Promise((res) => { setTimeout(res, length); });
}
exports.wait = wait;
/**
 * Returns the current event short according to the configuration file.
 */
function getCurrentEventShort() {
    const cfg = config.event.shorts;
    if (!Array.isArray(cfg))
        return cfg;
    return cfg[config.event.thisEvent - 1];
}
exports.getCurrentEventShort = getCurrentEventShort;
/**
 * Returns the other stream's event short according to the configuration file, if applicable.
 */
function getOtherStreamEventShort() {
    const cfg = config.event.shorts;
    if (!Array.isArray(cfg) || cfg.length === 1) {
        return undefined;
    }
    const eventNumber = config.event.thisEvent === 1 ? 2 : 1;
    return cfg[eventNumber - 1];
}
exports.getOtherStreamEventShort = getOtherStreamEventShort;
/**
 * Error log helper that logs a basic warn but a more detailed debug.
 * @param msg String to be logged.
 * @param err Error to be logged.
 * @param args List of argments to be supplied/substitued in the msg string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logError(msg, err, ...args) {
    const msgWithArgs = util_1.default.format(msg, ...args);
    (0, nodecg_1.get)().log.warn(msgWithArgs);
    (0, nodecg_1.get)().log.debug(`${msgWithArgs}: %s`, err);
}
exports.logError = logError;
/**
 * Takes the basic speedrun.com pronouns string and formats it for the layouts.
 * @param pronouns Pronouns string from speedrun.com, if any
 * @returns Formatted string, or undefined if the input was also undefined.
 */
function formatSrcomPronouns(pronouns) {
    if (!pronouns)
        return undefined;
    const split = pronouns.split(',').map((p) => p.trim().toLowerCase());
    if (split.length > 1) {
        if (split.includes('he/him') && split.includes('she/her') && !split.includes('they/them')) {
            return 'he or she';
        }
        const list = [];
        if (split.includes('he/him'))
            list.push('he');
        if (split.includes('she/her'))
            list.push('she');
        if (split.includes('they/them'))
            list.push('they');
        return list.join('/');
    }
    return split[0];
}
exports.formatSrcomPronouns = formatSrcomPronouns;
/**
 * Simple formatter for displaying USD amounts.
 * @param amount Amount as a integer/float.
 * @param noCents Never display cents, even if under $100.
 */
function formatUSD(amount, noCents = false) {
    if (amount >= 100 || noCents) {
        return `$${Math.floor(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    return `$${amount.toFixed(2)}`;
}
exports.formatUSD = formatUSD;
