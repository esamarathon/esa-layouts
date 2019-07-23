<template>
  <div
    v-show="show"
    id="ImageSlide"
  >
    <div
      v-if="video"
      class="Video"
    >
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
    <div
      v-else
      class="Image"
    >
      <img :src="src">
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

const media = nodecg.Replicant('assets:intermission-slides');
let index = 0;

export default {
  name: 'ImageSlide',
  data() {
    return {
      src: undefined,
      video: true,
      show: false,
    };
  },
  mounted() {
    NodeCG.waitForReplicants(media).then(() => {
      if (!media.value.length) {
        this.$emit('end');
        return;
      }

      if (index >= media.value.length) {
        index = 0;
      }

      let data;
      while (this.video) {
        data = media.value[index];
        this.src = data.url;
        this.video = data.ext.toLowerCase() === '.mp4';
        index += 1;
      }

      this.show = true;
      setTimeout(() => this.$emit('end'), 20 * 1000);
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
  #ImageSlide {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,0.3);
  }

  .Image, .Video {
    width: 100%;
    height: 100%;
  }

  .Image > img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }

  .Video > video {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
</style>
