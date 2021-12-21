"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const x32_1 = __importDefault(require("@shared/extension/x32"));
const nodecg_1 = require("./nodecg");
const x32 = new x32_1.default((0, nodecg_1.get)(), (0, nodecg_1.get)().bundleConfig.x32);
exports.default = x32;
