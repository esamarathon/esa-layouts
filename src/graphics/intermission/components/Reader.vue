<template>
  <div
    v-if="show"
    class="Reader FlexContainer"
  >
    <div class="Mic">
      <img src="Mic.png">
    </div>
    <div class="Name FlexContainer">
      {{ name }}
      <img
        v-if="country"
        :src="`/bundles/esa-layouts/static/flags/${country}.png`"
      >
    </div>
  </div>
</template>

<script>
const users = nodecg.Replicant('users', 'speedcontrol-flagcarrier');

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
    users.on('change', (newVal) => {
      if (newVal && newVal.donations && newVal.donations.reader) {
        this.name = newVal.donations.reader.display_name;
        this.country = newVal.donations.reader.country_code;
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
    border: 2px solid #8ebcdd;
    height: calc(60% - 4px);
  }
</style>
