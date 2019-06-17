<template>
  <div
    v-if="show"
    id="CommentatorBox"
    class="GameInfoBox FlexContainer"
  >
    Commentators: {{ name }}
  </div>
</template>

<script>
// import Vue from 'vue';

export default {
  name: 'CommentatorBox',
  data() {
    return {
      name: '',
      show: false,
    };
  },
  mounted() {
    this.show = true;
    this.name = 'zoton2, Planks, EdenalSDA, Ladaur';
    // will need to access values here
  },
};
</script>

<style>
  @import url('./GameInfoBox.css');
  @import url('./FlexContainer.css');

  #CommentatorBox {
    font-size: 30px;
    font-weight: 400;
    background-color: cadetblue;
  }
</style>
