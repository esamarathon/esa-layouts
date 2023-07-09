import { io, Socket } from 'socket.io-client';
import { logError } from './helpers';
import { get as nodecg } from './nodecg';

const config = nodecg().bundleConfig;
const address = new URL(
  `${config.offsite.address}${!config.offsite.address.endsWith('/') ? '/' : ''}`,
);
const socket: typeof Socket = io(
  address.origin,
  { path: `${address.pathname}socket.io`, autoConnect: false },
);

socket.on('connect', () => {
  socket.emit('authenticate', { key: 'esalayouts', pw: config.offsite.key });
  nodecg().log.info('[Offsite] Socket.IO client connected');
});
socket.on('authenticated', () => {
  nodecg().log.info('[Offsite] Socket.IO client authenticated');
});
socket.on('disconnect', (reason: string) => {
  logError('[Offsite] Socket.IO client disconnected', reason);
});

if (config.offsite.enabled) {
  socket.connect();
}

const offsite = socket;
export default offsite;
