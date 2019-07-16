<template>
  <div id="TTS" />
</template>

<script>
export default {
  name: 'TTS',
  mounted() {
    nodecg.listenFor('ttsToBeRead', (url) => {
      const audio = new Audio();
      audio.src = url;
      audio.play();
    });
  },
};
</script>

<style scoped>
  #TTS {
    display: none;
  }
</style>
