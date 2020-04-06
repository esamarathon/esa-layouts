<template>
  <div
    v-if="show"
    class="Reader Flex"
  >
    <div class="Mic">
      <img src="./Mic.png">
    </div>
    <div class="Name Flex">
      {{ name }}
      <!--<img
        v-if="country"
        :src="`/bundles/esa-layouts/static/flags/${country}.png`"
      >-->
    </div>
  </div>
</template>

<script>
const donationReader = nodecg.Replicant('donationReader');

export default {
  name: 'Reader',
  data() {
    return {
      show: false,
      name: '',
      country: 'gb',
    };
  },
  mounted() {
    donationReader.on('change', (newVal) => {
      if (newVal) {
        this.show = true;
        this.name = newVal;
      } else {
        this.show = false;
      }
    });
  },
};
</script>

<style scoped>
  .Reader {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .Mic {
    box-sizing: border-box;
    background-color: var(--border-colour);
    height: 100%;
    padding: 5px;
  }

  .Mic > img {
    height: 100%;
    object-fit: contain;
  }

  .Name {
    padding: 0 15px;
    line-height: 70%;
    height: 100%;
  }

  .Name > img {
    margin-left: 10px;
    border: 2px solid var(--font-colour-inverted);
    height: calc(60% - 4px);
  }
</style>
