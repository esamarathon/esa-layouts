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
import { State, Mutation } from 'vuex-class';
import goTo from 'vuetify/es5/services/goto';
import { TtsVoices } from 'schemas';
import { Configschema } from 'configschema';
import { UpdateSelectedVoice } from './store';

@Component
export default class extends Vue {
  @State voices!: TtsVoices;
  @Mutation updateSelectedVoice!: UpdateSelectedVoice;
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

  get selected(): TtsVoices['selected'] | undefined {
    return this.voices.selected;
  }
  set selected(val) {
    this.updateSelectedVoice(val);
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
