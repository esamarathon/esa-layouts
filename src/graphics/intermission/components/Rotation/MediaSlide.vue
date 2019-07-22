<template>
  <div
    v-show="show"
    id="MediaSlide"
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
let index = 3;

export default {
  name: 'MediaSlide',
  data() {
    return {
      src: undefined,
      video: false,
      show: false,
    };
  },
  mounted() {
    NodeCG.waitForReplicants(media).then(() => {
      if (index >= media.value.length) {
        index = 0;
      }

      const data = media.value[index];
      this.src = data.url;
      this.video = data.ext.toLowerCase() === '.mp4';

      this.show = true;
      if (this.video) {
        Vue.nextTick().then(() => this.playVideo());
      } else {
        setTimeout(() => this.$emit('end'), 20 * 1000);
      }

      index += 1;
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
  #MediaSlide {
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
