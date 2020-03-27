<template>
  <v-app>
    <b>Channel:</b> {{ restreamViewerTool.channel }}
    <br><b>Overridden:</b> {{ restreamViewerTool.overridden }}
    <br><br><b>Override</b>
    <div class="d-flex">
      <v-text-field
        v-model="channelEntry"
        label="Enter Twitch Channel"
        hide-details
        filled
        :spellcheck="false"
        @keyup.enter="override"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        @click="override"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RestreamViewerTool } from 'schemas';

@Component
export default class extends Vue {
  @State restreamViewerTool!: RestreamViewerTool;
  channelEntry = '';

  override(): void {
    nodecg.sendMessage('rvtOverride', this.channelEntry);
    this.channelEntry = '';
  }
}
</script>
