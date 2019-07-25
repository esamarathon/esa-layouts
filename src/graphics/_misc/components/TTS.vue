<template>
  <div id="TTS" />
</template>

<script>
export default {
  name: 'TTS',
  data() {
    return {
      audio: new Audio(),
    };
  },
  mounted() {
    nodecg.listenFor('ttsToBeRead', (url) => {
      this.audio.src = url;
      this.audio.play();
    });
  },
};
</script>

<style scoped>
  #TTS {
    display: none;
  }
</style>
