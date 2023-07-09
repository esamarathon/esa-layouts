"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sc = void 0;
const speedcontrol_util_1 = require("speedcontrol-util");
const nodecg_1 = require("./nodecg");
// eslint-disable-next-line import/prefer-default-export
exports.sc = new speedcontrol_util_1.SpeedcontrolUtil((0, nodecg_1.get)());
