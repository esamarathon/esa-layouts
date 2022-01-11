<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Backend from './backend';

@Component
export default class extends Vue {
  backend!: Backend;

  beforeCreate(): void {
    this.backend = new Backend();
    window.connectElgatoStreamDeckSocket = (
      inPort: string,
      inPluginUUID: string,
      inRegisterEvent: string,
      inInfo: string,
    ) => {
      this.backend.connectElgatoStreamDeckSocket(
        inPort,
        inPluginUUID,
        inRegisterEvent,
        inInfo,
      );
    };
    this.backend.on('message', (data) => {
      if (data.action
        && (data.action.includes('ttsdonations') || data.action.includes('donationread'))) {
        if (data.event === 'didReceiveSettings' || data.event === 'willAppear') {
          let title = '';
          if (data.action.includes('ttsdonations')) {
            title = `Play\nDonation\n${data.payload.settings.slot + 1}`;
          } else if (data.action.includes('donationread')) {
            title = `Mark\nDonation\n${data.payload.settings.slot + 1}\nas Read`;
          }
          this.backend.sdWS.send(JSON.stringify({
            event: 'setTitle',
            context: data.context,
            payload: { title },
          }));
        }
      }

      // Set titles for playerhudtrigger-X
      if (data.action && data.action.startsWith('playerhudtrigger')) {
        if (data.event === 'didReceiveSettings' || data.event === 'willAppear') {
          let title = '';
          if (data.action.includes('message')) {
            title = 'Message\nTo Read';
          }
          this.backend.sdWS.send(JSON.stringify({
            event: 'setTitle',
            context: data.context,
            payload: { title },
          }));
        }
      }
    });
  }
}
</script>
