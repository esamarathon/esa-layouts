import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import { smbRelay } from './util/replicants';

// Initial list of players, can be edited or restored to from dashboard.
const players = [
  'G3neziz',
  'MoD366',
  'lelelop',
  'Tompa',
  'Floha',
  'Pikastroff',
  'Rusyxx',
  'Nardiko',
  'Kaadzik',
  'Zet237',
  'Ulvind',
  'Makkebakke',
  'hedweg',
  'JackOfHearts',
  'Riekelt',
  'BroedgeMan',
  'Shigan',
  'Edenal',
  'MisterPanda',
  '7eraser7',
  'Zas',
  'Sushi',
  'yisk',
  'xoneris',
  'RoboSparkle',
  'Garnonymous',
  'Murtag',
  'Blodds',
  'PokerFacowaty',
  'Aetienne',
  'Fuzzyness',
  '360Chrism',
];

const sc = new SpeedcontrolUtil(nodecg());

sc.runDataActiveRun.on('change', (val) => {
  if (val && val.customData.id === '260e49dc5db49745a4640d81' && !smbRelay.value.current) {
    smbRelay.value.current = 0;
  } else {
    delete smbRelay.value.current;
  }
});

if (!smbRelay.value.players.length) {
  smbRelay.value.players.push(...players);
}

nodecg().listenFor('smbRelayDefaultPlayers', () => {
  smbRelay.value.players.splice(0, smbRelay.value.players.length, ...players);
});
