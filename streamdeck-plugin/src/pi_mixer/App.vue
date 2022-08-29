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
      <div class="sdpi-item-label">OSC Address</div>
      <input v-model="address" class="sdpi-item-value">
    </div>
  </div>
</template>

<script lang="ts">
import PropertyInspector from '@/pi/pi';
import debounce from 'lodash.debounce';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class extends Vue {
  pi!: PropertyInspector;
  address = '';

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
        if (typeof data?.payload?.settings?.address !== 'string') {
          this.onAddressChanged(this.address);
        } else this.address = data.payload.settings.address;
      }
    });
  }

  addressChange(address: string): void {
    this.pi.sdWS.send(JSON.stringify({
      event: 'setSettings',
      context: this.pi.connectSocketData.inPropertyInspectorUUID,
      payload: { address },
    }));
  }
  addressChangeDebounce = debounce(this.addressChange, 1000);

  @Watch('address')
  onAddressChanged(address: string): void {
    this.addressChangeDebounce(address);
  }

  openSettings(): void {
    this.pi.openSettings();
  }
}
</script>
