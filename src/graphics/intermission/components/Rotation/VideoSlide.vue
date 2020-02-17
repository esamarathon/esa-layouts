<template>
  <div
    v-show="show"
    id="VideoSlide"
  >
    <div class="Video">
      <video
        ref="Video"
        muted
      >
        <source
          :src="src"
          type="video/mp4"
        >
      </video>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

const media = nodecg.Replicant('assets:intermission-slides');
let index = 0;

export default {
  name: 'VideoSlide',
  data() {
    return {
      src: undefined,
      show: false,
    };
  },
  mounted() {
    NodeCG.waitForReplicants(media).then(() => {
      const videos = media.value.filter((v) => v.ext.toLowerCase() === '.mp4');
      if (!videos.length) {
        this.$emit('end');
        return;
      }

      if (index >= videos.length) {
        index = 0;
      }
      const data = videos[index];
      this.src = data.url;
      index += 1;

      this.show = true;
      Vue.nextTick().then(() => this.playVideo());
    });
  },
  methods: {
    playVideo() {
      this.$refs.Video.load();
      this.$refs.Video.play();
      this.$refs.Video.addEventListener('ended', this.endOfVideo, { once: true });
    },
    endOfVideo() {
      this.$emit('end');
    },
  },
};
</script>

<style scoped>
  #VideoSlide {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,0.3);
  }

  .Video {
    width: 100%;
    height: 100%;
  }

  .Video > video {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
</style>
