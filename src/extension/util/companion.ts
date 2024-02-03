import { Emitter } from 'strict-event-emitter';
import url from 'url';
import WebSocket, { WebSocketServer } from 'ws';
import { get as nodecg } from './nodecg';

const config = nodecg().bundleConfig.companion;
let wss: WebSocketServer | undefined;
const evt = new Emitter<{
  open: [socket: WebSocket];
  action: [name: string, value: unknown];
}>();

if (config.enabled) {
  wss = new WebSocketServer({ port: config.port });
  nodecg().log.info('[Companion] Listening for client connections on port %s', config.port);

  wss.on('connection', (socket, request) => {
    // Get key from request query.
    let key;
    if (request.url) key = (url.parse(request.url, true)).query.key;

    if (!key || key !== config.key) {
      nodecg().log.debug('[Companion] Client tried to connect with incorrect key');
      socket.close();
      return;
    }

    evt.emit('open', socket);
    nodecg().log.debug('[Companion] Client fully connected');

    socket.on('error', (err) => {
      nodecg().log.warn('[Companion] Client connection error (%)');
      nodecg().log.debug('[Companion] Client connection error:', err);
    });
    socket.on('close', (code, reason) => {
      nodecg().log.warn(
        '[Companion] Client connection closed (%s)',
        `${code}${(reason) ? `, ${reason}` : ''}`,
      );
      socket.removeAllListeners();
    });
    socket.on('message', (data) => {
      const { name, value }: { name: string, value: unknown } = JSON.parse(data.toString());
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
function send(data: { name: string, value: unknown }, socket?: WebSocket) {
  if (socket) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  } else {
    if (!wss) return;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

export default {
  evt,
  send,
};
