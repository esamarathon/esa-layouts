<template>
  <div
    v-if="show"
  >
    Voice: <select v-model="selected">
      <option
        v-for="(option, name) in options"
        :key="name"
        :value="name"
      >
        {{ option }}
      </option>
    </select>
    <br><br>
    <button
      @click="playExample"
    >
      Play Example
    </button>
  </div>
</template>

<script>
const availableVoices = nodecg.Replicant('ttsVoices');
const chosenVoice = nodecg.Replicant('ttsChosenVoice');

export default {
  name: 'TTSDonationControl',
  data() {
    return {
      show: false,
      selected: '',
      options: {},
    };
  },
  watch: {
    selected(val) {
      chosenVoice.value = val;
    },
  },
  mounted() {
    // Populates the dropdown when the available voices change.
    availableVoices.on('change', (newVal) => {
      this.options = {};
      if (newVal && newVal.length) {
        this.show = true;
        newVal.forEach((voice) => {
          this.options[voice.code] = voice.name;
        });
      } else {
        this.show = false;
      }
    });

    // Changes the selected option if the layout has been changed.
    chosenVoice.on('change', (newVal) => {
      this.selected = newVal;
    });
  },
  methods: {
    playExample() {
      nodecg.sendMessage('ttsSpeakExample');
    },
  },
};
</script>
