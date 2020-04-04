<template>
  <v-app>
    <div
      v-if="!config.enable"
      :style="{
        'font-style': 'italic',
      }"
    >
      This feature is not enabled.
    </div>
    <template v-else>
      <div class="d-flex">
        <v-text-field
          ref="ChannelEntry"
          v-model="channelEntry"
          label="Enter Twitch Channel"
          hide-details
          filled
          :spellcheck="false"
          :disabled="applying"
          @keyup.enter="override"
          @focus="focusChannelEntry"
          @input="focusChannelEntry"
          @blur="unfocusChannelEntry"
        />
        <v-btn
          height="56px"
          :style="{ 'min-width': '0', 'margin-left': '5px' }"
          :disabled="applying"
          :loading="applying"
          @click="override"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </div>
      <v-switch
        v-model="lowLatency"
        class="ma-1"
        hide-details
        label="Low Latency"
        :disabled="applying"
        @change="changeLatency"
      />
      <div :style="{ 'margin': '10px 0' }">
        <span :style="{ 'font-weight': 'bold' }">
          Currently Overridden:
        </span>
        {{ restreamViewerTool.overridden }}
      </div>
      <div class="d-flex">
        <v-btn
          :style="{ 'min-width': '0', flex: '1' }"
          :disabled="applying"
          @click="restart"
        >
          <v-icon>mdi-refresh</v-icon> Restart
        </v-btn>
        <v-btn
          :style="{ 'min-width': '0', 'margin-left': '5px', flex: '1' }"
          :disabled="applying"
          @click="stop"
        >
          <v-icon>mdi-stop</v-icon> Stop
        </v-btn>
      </div>
    </template>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RestreamViewerTool } from 'schemas';
import { Configschema } from 'configschema';

@Component
export default class extends Vue {
  @State restreamViewerTool!: RestreamViewerTool;
  channelEntry = '';
  lowLatency = true;
  config = (nodecg.bundleConfig as Configschema).restream;
  applying = false;
  channelEntryFocused = false;
  channelEntryFocusedTimeout: number | undefined;

  @Watch('restreamViewerTool', { immediate: true })
  onRestreamViewerToolChanged(val: RestreamViewerTool): void {
    if (!this.channelEntryFocused) {
      this.channelEntry = val.channel || '';
    }
    this.lowLatency = val.lowLatency ?? true;
  }

  focusChannelEntry(): void {
    this.channelEntryFocused = true;
    window.clearTimeout(this.channelEntryFocusedTimeout);
    this.channelEntryFocusedTimeout = window.setTimeout(() => {
      (this.$refs.ChannelEntry as HTMLElement).blur();
      this.channelEntry = this.restreamViewerTool.channel || '';
    }, 5 * 1000);
  }

  unfocusChannelEntry(): void {
    this.channelEntryFocused = false;
    window.clearTimeout(this.channelEntryFocusedTimeout);
  }

  override(): void {
    this.applying = true;
    nodecg.sendMessage('rvtOverride', { channel: this.channelEntry })
      .finally(() => { this.applying = false; });
  }

  changeLatency(): void {
    this.applying = true;
    nodecg.sendMessage('rvtOverride', { lowLatency: this.lowLatency })
      .finally(() => { this.applying = false; });
  }

  restart(): void {
    this.applying = true;
    nodecg.sendMessage('rvtRestart')
      .finally(() => { this.applying = false; });
  }

  stop(): void {
    this.applying = true;
    nodecg.sendMessage('rvtStop')
      .finally(() => { this.applying = false; });
  }
}
</script>
