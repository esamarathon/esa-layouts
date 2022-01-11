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
      <select v-model="slot" class="sdpi-item-value select">
        <option value="0">1</option>
        <option value="1">2</option>
        <option value="2">3</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import PropertyInspector from '@/pi/pi';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component
export default class extends Vue {
  pi!: PropertyInspector;
  slot = 0;

  beforeCreate(): void {
    this.pi = new PropertyInspector();
    window.connectElgatoStreamDeckSocket = (
      inPort: string,
      inPropertyInspectorUUID: string,
      inRegisterEvent: string,
      inInfo: string,
      inActionInfo: string,
    ) => {
      this.pi.connectElgatoStreamDeckSocket(
        inPort,
        inPropertyInspectorUUID,
        inRegisterEvent,
        inInfo,
        inActionInfo,
      );
    };
    window.gotCallbackFromWindow = (data: { url: string, key: string }) => {
      this.pi.gotCallbackFromWindow(data);
    };
    this.pi.on('open', () => {
      this.pi.sdWS.send(JSON.stringify({
        event: 'getSettings',
        context: this.pi.connectSocketData.inPropertyInspectorUUID,
      }));
    });
    this.pi.on('message', (data) => {
      if (data.event === 'didReceiveSettings') {
        // Force setting to be created.
        if (typeof data?.payload?.settings?.slot !== 'number') this.onSlotChanged(this.slot);
        else this.slot = data.payload.settings.slot;
      }
    });
  }

  @Watch('slot')
  onSlotChanged(slot: number | string): void {
    this.pi.sdWS.send(JSON.stringify({
      event: 'setSettings',
      context: this.pi.connectSocketData.inPropertyInspectorUUID,
      payload: { slot: Number(slot) },
    }));
  }

  openSettings(): void {
    this.pi.openSettings();
  }
}
</script>
