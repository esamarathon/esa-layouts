<template>
  <div
    class="DonationBox FlexContainer"
    :style="css"
  >
    {{ name }} - ${{ amount }}
  </div>
</template>

<script>
export default {
  name: 'DonationBox',
  props: {
    name: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      css: {
        'background-color': 'purple',
      },
    };
  },
  created() {
    // Choose a random colour when created (colours need editing).
    const colours = ['#405a9b', '#5573be', '#6b83c2', '#1c4cc5'];
    const rand = colours[Math.floor(Math.random() * colours.length)];
    this.css['background-color'] = rand;
  },
};
</script>

<style scoped>
  @import url('./FlexContainer.css');

  .DonationBox {
    height: 100%;
    padding: 0 15px;
    font-size: 30px;
  }
</style>
