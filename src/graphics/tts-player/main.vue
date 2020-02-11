<template>
  <div>
    <text-to-speech />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TextToSpeech from '../_misc/components/TextToSpeech.vue';

@Component({
  components: {
    TextToSpeech,
  },
})
export default class extends Vue {}
</script>
