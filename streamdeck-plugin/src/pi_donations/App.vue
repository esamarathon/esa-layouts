<template>
  <div class="sdpi-wrapper">
    <!-- Shared settings button. -->
    <div class="sdpi-item">
      <div class="sdpi-item-label">Settings</div>
      <button class="sdpi-item-value" id="settingsButton" @click="openSettings">
        Open Settings Dialog
      </button>
    </div>

    <!-- Action specific settings. -->
    <div class="sdpi-item">
      <div class="sdpi-item-label">Donation Slot</div>
      <select
        class="sdpi-item-value select"
        onchange="changeSlot(this.options[this.selectedIndex].value)"
      >
        <option value="0">1</option>
        <option value="1">2</option>
        <option value="2">3</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

// "init" should be called within "sdWS.addEventListener('open', () => {"
// "didReceiveSettings" should be called witin "sdWS.addEventListener('message', e => {"
/*
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
  sdWS.send(JSON.stringify({
    event: 'setSettings',
    context: connectSocketData.pluginUUID,
    payload: { slot },
  }));
}
*/

@Component
export default class extends Vue {
  openSettings(): void {
    window.open('settings.html');
  }
}
</script>
