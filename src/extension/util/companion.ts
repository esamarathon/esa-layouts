import url from 'url';
import { WebSocketServer } from 'ws';
import { get as nodecg } from './nodecg';

const config = nodecg().bundleConfig.companion;
let wss: WebSocketServer | undefined;

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

    // TODO: SEND THINGS ON CONNECTION!

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
    socket.on('message', (data, isBinary) => {
      // const msg: { /* types */ } = JSON.parse(data.toString());
      // do thing with message
    });
  });
}
