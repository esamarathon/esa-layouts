<template>
  <div>
    <video
      v-show="videoSrc"
      ref="VideoPlayer"
    >
      <source
        :src="videoSrc"
        type="video/mp4"
      >
    </video>
  </div>
</template>

<script>
const current = nodecg.Replicant('currentVideoObj');

export default {
  name: 'VideoPlayer',
  data() {
    return {
      videoSrc: undefined,
    };
  },
  mounted() {
    window.obsstudio.onActiveChange = (active) => {
      if (active) {
        this.playVideo();
      } else {
        this.stopVideo();
      }
    };
  },
  methods: {
    playVideo() {
      if (current.value) {
        this.videoSrc = current.value.url;
        this.$refs.VideoPlayer.load();
        this.$refs.VideoPlayer.play();
        this.$refs.VideoPlayer.addEventListener('ended', this.endOfVideo);
      }
    },
    stopVideo() {
      this.$refs.VideoPlayer.removeEventListener('ended', this.endOfVideo);
      this.$refs.VideoPlayer.pause();
      this.videoSrc = undefined;
      this.$refs.VideoPlayer.load();
    },
    endOfVideo() {
      nodecg.sendMessage('videoFinished');
    },
  },
};
</script>

<style>
  body {
    overflow: hidden;
    margin: 0;
    padding: 0;
    background-color: black;
  }

  video {
    display: block;
    width: 1920px;
    height: 1080px;
  }
</style>
