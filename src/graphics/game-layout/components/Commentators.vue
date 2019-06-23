<template>
  <div
    v-if="show"
    id="CommentatorsBox"
    class="RunInfoBox FlexContainer"
  >
    <span id="CommHeader">
      Commentators:
    </span>
    &nbsp;{{ text }}
  </div>
</template>

<script>
// import Vue from 'vue';

export default {
  name: 'Commentators',
  data() {
    return {
      text: '',
      show: false,
    };
  },
  mounted() {
    this.show = true;
    this.text = 'zoton2, Planks, EdenalSDA, Ladaur';
    // will need to access values here
  },
};
</script>

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('./FlexContainer.css');

  #CommentatorsBox {
    padding: 0;
    font-size: 25px;
    font-weight: 400;
    background-color: cadetblue;
    height: 40px;
  }

  #CommHeader {
    font-weight: 500;
  }
</style>
