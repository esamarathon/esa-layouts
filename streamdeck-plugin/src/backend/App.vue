<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

// TO BE WORKED INTO "sdWS.addEventListener('message', e => {"?
// Set titles for ttsdonations/donationread
/*
if (data.action && (data.action.includes('ttsdonations') || data.action.includes('donationread'))) {
  if (data.event === 'didReceiveSettings' || data.event === 'willAppear') {
    let title = '';
    if (data.action.includes('ttsdonations')) {
      title = `Play\nDonation\n${data.payload.settings.slot + 1}`;
    } else if (data.action.includes('donationread')) {
      title = `Mark\nDonation\n${data.payload.settings.slot + 1}\nas Read`;
    }
    sdWS.send(JSON.stringify({ event: 'setTitle', context: data.context, payload: { title } }));
  }
}

// Set titles for playerhudtrigger-X
if (data.action && data.action.startsWith('playerhudtrigger')) {
  if (data.event === 'didReceiveSettings' || data.event === 'willAppear') {
    let title = '';
    if (data.action.includes('message')) {
      title = 'Message\nTo Read';
    }
    sdWS.send(JSON.stringify({ event: 'setTitle', context: data.context, payload: { title } }));
  }
}
*/

@Component
export default class extends Vue {}
</script>
