<template>
  <v-app>
    <div
      v-if="!config.enable"
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
import { State } from 'vuex-class';
import { State2Way } from 'vuex-class-state2way';
import goTo from 'vuetify/es5/services/goto';
import { TtsVoices } from '@esa-layouts/types/schemas';
import { Configschema } from '@esa-layouts/types/schemas/configschema';

@Component
export default class extends Vue {
  @State voices!: TtsVoices;
  @State2Way('updateSelectedVoice', 'voices.selected') selected!: TtsVoices['selected'];
  config = (nodecg.bundleConfig as Configschema).tts;

  @Watch('voices')
  scrollToSelectedVoice(): void {
    if (this.config.enable) {
      goTo(`#${this.voices.selected}`, { container: '#VoiceList', offset: 25 });
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
