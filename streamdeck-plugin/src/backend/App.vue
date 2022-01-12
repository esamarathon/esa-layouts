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
      // Some logic that can happily belong Stream Deck side and doesn't need to be in
      // a NodeCG extension file.
      const actionName = (data.action as string)?.split('.').pop() || '';

      if (['didReceiveSettings', 'willAppear'].includes(data.event)) {
        // Set titles for ttsdonations.
        if (actionName.startsWith('ttsdonations')) {
          this.backend.sendToSDWS({
            event: 'setTitle',
            context: data.context,
            payload: { title: `Play\nDonation\n${data.payload.settings.slot + 1}` },
          });
        // Set titles for donationread.
        } else if (actionName.startsWith('donationread')) {
          this.backend.sendToSDWS({
            event: 'setTitle',
            context: data.context,
            payload: { title: `Mark\nDonation\n${data.payload.settings.slot + 1}\nas Read` },
          });
        }
        // Set titles for playerhudtrigger-message.
        /* } else if (actionName.startsWith('playerhudtrigger-message')) {
          this.backend.sendToSDWS({
            event: 'setTitle',
            context: data.context,
            payload: { title: 'Message\nTo Read' },
          });
        } */
      }
    });
  }
}
</script>
