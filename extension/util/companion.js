"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_event_emitter_1 = require("strict-event-emitter");
const url_1 = __importDefault(require("url"));
const ws_1 = __importStar(require("ws"));
const nodecg_1 = require("./nodecg");
const config = (0, nodecg_1.get)().bundleConfig.companion;
let wss;
const evt = new strict_event_emitter_1.Emitter();
if (config.enabled) {
    wss = new ws_1.WebSocketServer({ port: config.port });
    (0, nodecg_1.get)().log.info('[Companion] Listening for client connections on port %s', config.port);
    wss.on('connection', (socket, request) => {
        // Get key from request query.
        let key;
        if (request.url)
            key = (url_1.default.parse(request.url, true)).query.key;
        if (!key || key !== config.key) {
            (0, nodecg_1.get)().log.debug('[Companion] Client tried to connect with incorrect key');
            socket.close();
            return;
        }
        evt.emit('open', socket);
        (0, nodecg_1.get)().log.debug('[Companion] Client fully connected');
        socket.on('error', (err) => {
            (0, nodecg_1.get)().log.warn('[Companion] Client connection error (%)');
            (0, nodecg_1.get)().log.debug('[Companion] Client connection error:', err);
        });
        socket.on('close', (code, reason) => {
            (0, nodecg_1.get)().log.warn('[Companion] Client connection closed (%s)', `${code}${(reason) ? `, ${reason}` : ''}`);
            socket.removeAllListeners();
        });
        socket.on('message', (data) => {
            const { name, value } = JSON.parse(data.toString());
            evt.emit('action', name, value);
        });
    });
}
/**
 * Send data over the WebSocket connections to client(s).
 * @param data.name Name of the data to send.
 * @param data.value Value of the data to send.
 * @param socket If specified, only sends to that client, otherwise sends to all.
 */
function send(data, socket) {
    if (socket) {
        if (socket.readyState === ws_1.default.OPEN) {
            socket.send(JSON.stringify(data));
        }
    }
    else {
        if (!wss)
            return;
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}
exports.default = {
    evt,
    send,
};
