<template>
  <div
    v-if="show"
    class="Music FlexContainer"
  >
    <div class="MCat">
      <img src="MCat_Logo.png">
    </div>
    <div class="Name">
      {{ name }}
    </div>
  </div>
</template>

<script>
const song = nodecg.Replicant('songData');

export default {
  name: 'Music',
  data() {
    return {
      show: false,
      name: '',
    };
  },
  mounted() {
    song.on('change', (newVal) => {
      if (newVal && newVal.playing) {
        this.name = newVal.title;
        this.show = true;
      } else {
        this.show = false;
      }
    });
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  .Music {
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .MCat {
    box-sizing: border-box;
    background-color: var(--border-colour);
    height: 100%;
    padding: 5px;
  }

  .MCat > img {
    height: 100%;
    object-fit: contain;
  }

  .Name {
    flex: 1;
    padding: 0 15px;
    line-height: 70%;
  }
</style>
