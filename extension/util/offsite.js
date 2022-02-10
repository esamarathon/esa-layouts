"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const helpers_1 = require("./helpers");
const nodecg_1 = require("./nodecg");
const config = (0, nodecg_1.get)().bundleConfig;
const address = new URL(config.offsite.address);
const socket = (0, socket_io_client_1.io)(address.origin, { path: `${address.pathname}socket.io`, autoConnect: false });
socket.on('connect', () => {
    socket.emit('authenticate', { key: 'esalayouts', pw: config.offsite.key });
    (0, nodecg_1.get)().log.info('[Offsite] Socket.IO client connected');
});
socket.on('authenticated', () => {
    (0, nodecg_1.get)().log.info('[Offsite] Socket.IO client authenticated');
});
socket.on('disconnect', (reason) => {
    (0, helpers_1.logError)('[Server] Socket.IO client disconnected', reason);
});
if (config.offsite.enabled) {
    socket.connect();
}
const offsite = socket;
exports.default = offsite;
