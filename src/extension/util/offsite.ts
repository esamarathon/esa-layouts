import { Configschema } from '@esa-layouts/types/schemas/configschema';
import { io, Socket } from 'socket.io-client';
import { logError } from './helpers';
import { get as nodecg } from './nodecg';

const config = (nodecg().bundleConfig as Configschema);
const address = new URL(config.offsite.address);
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
