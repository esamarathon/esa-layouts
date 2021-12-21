"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const obs_1 = __importDefault(require("@shared/extension/obs"));
const nodecg_1 = require("./nodecg");
const obs = new obs_1.default((0, nodecg_1.get)(), (0, nodecg_1.get)().bundleConfig.obs);
exports.default = obs;
