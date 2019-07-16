let settings = {};

function init() {
  sdWS.send(JSON.stringify({ event: 'getSettings', context: connectSocketData.pluginUUID }));
}

function didReceiveSettings(data) {
  settings = data;
  let slot = 0;
  if (!data.payload.settings || !data.payload.settings.slot) {
    changeSlot(slot);
  } else {
    slot = data.payload.settings.slot;
  }
  document.getElementsByTagName("select")[0].value = slot;
}

function changeSlot(slot) {
  slot = Number(slot);
  sdWS.send(JSON.stringify({ event: 'setSettings', context: connectSocketData.pluginUUID, payload: { slot } }));
}
