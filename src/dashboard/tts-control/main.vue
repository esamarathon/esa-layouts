<template>
  <v-app>
    <div
      v-if="!config.enabled"
      :style="{ 'font-style': 'italic' }"
    >
      This feature is not enabled.
    </div>
    <template v-else>
      <div
        id="VoiceList"
        :style="{
          'max-height': '250px',
          'overflow-y': 'auto',
        }"
      >
        <v-radio-group
          v-model="selected"
          hide-details
          :style="{
            margin: '0px',
            padding: '10px',
          }"
        >
          <v-radio
            v-for="voice in voices.available"
            :id="voice.code"
            :key="voice.code"
            :value="voice.code"
            :label="voice.name"
          />
        </v-radio-group>
      </div>
      <v-btn @click="playExample">
        Play Example Donation
      </v-btn>
    </template>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { TtsVoices } from '@esa-layouts/types/schemas';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { storeModule } from './store';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.ttsVoices) readonly voices!: TtsVoices;
  config = (nodecg.bundleConfig as Configschema).tts;

  get selected(): TtsVoices['selected'] {
    return this.voices.selected;
  }
  set selected(val: string | undefined) {
    storeModule.updateSelectedVoice(val);
  }

  @Watch('voices')
  scrollToSelectedVoice(): void {
    if (this.config.enabled) {
      this.$vuetify.goTo(`#${this.voices.selected}`, { container: '#VoiceList', offset: 25 });
    }
  }

  playExample(): void {
    nodecg.sendMessage('ttsExample');
  }

  mounted(): void {
    this.scrollToSelectedVoice();
  }
}
</script>

<style>
  .v-input--hide-details > .v-input__control > .v-input__slot {
    margin-bottom: 2px !important;
  }
</style>
