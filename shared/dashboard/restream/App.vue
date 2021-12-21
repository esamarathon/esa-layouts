<template>
  <div>
    <div class="font-weight-bold pb-1">
      {{ name }}
    </div>
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
    <div :style="{ 'margin': '10px 0' }">
      <span :style="{ 'font-weight': 'bold' }">
        Currently Overridden:
      </span>
      {{ overridden }}
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { RestreamData } from '../../types/schemas';

@Component
export default class extends Vue {
  @Prop({ type: String, default: 'Stream 1' }) name!: string;
  @Prop({ type: Number, default: 0 }) index!: number;
  @Prop(Array) restreamData!: RestreamData;
  channelEntry = '';
  applying = false;
  channelEntryFocused = false;
  channelEntryFocusedTimeout: number | undefined;

  @Watch('restreamData', { immediate: true })
  onRestreamDataChanged(val: RestreamData): void {
    if (!this.channelEntryFocused) {
      this.channelEntry = val[this.index]?.channel || '';
    }
  }

  get overridden(): boolean {
    return this.restreamData[this.index].overridden;
  }

  focusChannelEntry(): void {
    this.channelEntryFocused = true;
    window.clearTimeout(this.channelEntryFocusedTimeout);
    this.channelEntryFocusedTimeout = window.setTimeout(() => {
      (this.$refs.ChannelEntry as HTMLElement).blur();
      this.channelEntry = this.restreamData[this.index].channel || '';
    }, 5 * 1000);
  }

  unfocusChannelEntry(): void {
    this.channelEntryFocused = false;
    window.clearTimeout(this.channelEntryFocusedTimeout);
  }

  override(): void {
    this.applying = true;
    nodecg.sendMessage('restreamOverride', { index: this.index, channel: this.channelEntry })
      .finally(() => { this.applying = false; });
  }

  restart(): void {
    this.applying = true;
    nodecg.sendMessage('restreamRestart', { index: this.index })
      .finally(() => { this.applying = false; });
  }

  stop(): void {
    this.applying = true;
    nodecg.sendMessage('restreamStop', { index: this.index })
      .finally(() => { this.applying = false; });
  }
}
</script>
