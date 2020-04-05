<template>
  <div
    v-show="show"
    id="ImageSlide"
  >
    <div class="Image">
      <img :src="src">
    </div>
  </div>
</template>

<script>

const media = nodecg.Replicant('assets:intermission-slides');
let index = 0;

export default {
  name: 'ImageSlide',
  data() {
    return {
      src: undefined,
      show: false,
    };
  },
  mounted() {
    NodeCG.waitForReplicants(media).then(() => {
      const images = media.value.filter((v) => v.ext.toLowerCase() !== '.mp4' && v.ext.toLowerCase() !== '.webm');
      if (!images.length) {
        this.$emit('end');
        return;
      }

      if (index >= images.length) {
        index = 0;
      }
      const data = images[index];
      this.src = data.url;
      index += 1;

      this.show = true;
      setTimeout(() => this.$emit('end'), 20 * 1000);
    });
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

  .Image {
    width: 100%;
    height: 100%;
  }

  .Image > img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
</style>
