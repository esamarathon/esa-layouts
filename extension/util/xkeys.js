"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xkeys_esa_1 = __importDefault(require("@shared/extension/xkeys-esa"));
const nodecg_1 = require("./nodecg");
const xkeys = new xkeys_esa_1.default((0, nodecg_1.get)(), (0, nodecg_1.get)().bundleConfig.xkeys);
exports.default = xkeys;
