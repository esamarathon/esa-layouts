<template>
  <v-app>
    <div
      id="VoiceList"
      :style="{
        'max-height': '250px',
        'overflow-y': 'scroll',
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
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
// @ts-ignore: goTo isn't typed
import goTo from 'vuetify/es5/services/goTo';
import { TtsVoices } from 'schemas';
import { UpdateSelectedVoice } from './store';

@Component
export default class extends Vue {
  @State voices!: TtsVoices;
  @Mutation updateSelectedVoice!: UpdateSelectedVoice;

  @Watch('voices')
  scrollToSelectedVoice(): void {
    goTo(`#${this.voices.selected}`, { container: '#VoiceList', offset: 25 });
  }

  // eslint-disable-next-line class-methods-use-this
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
