"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mediabox_1 = __importDefault(require("@shared/extension/mediabox"));
const nodecg_1 = require("./nodecg");
const obs_1 = __importDefault(require("./obs"));
const rabbitmq_1 = require("./rabbitmq");
const mb = new mediabox_1.default((0, nodecg_1.get)(), rabbitmq_1.mq.evt, obs_1.default, (0, nodecg_1.get)().bundleConfig.obs);
exports.default = mb;
