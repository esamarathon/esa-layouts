<template>
  <div
    class="DonationBox FlexContainer"
    :style="css"
  >
    ${{ amount }} [{{ name }}]
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
        'background-color': '#301b4c',
        color: '#f1d13f',
        'font-weight': 500,
        'font-size': '30px',
      },
    };
  },
  created() {
    if (this.amount < 50) {
      const shades = ['#301b4c', '#281643', '#502f59'];
      const rand = Math.floor(Math.random() * shades.length);
      this.css['background-color'] = shades[rand];
    } else if (this.amount < 100 && this.amount >= 50) {
      const shades = ['#f1d13f', '#fbd93f', '#e1c43c'];
      const rand = Math.floor(Math.random() * shades.length);
      this.css['background-color'] = shades[rand];
      this.css.color = '#604054';
      this.css['font-weight'] = 600;
    } else {
      this.css['background-color'] = '#efbe00';
      this.css.color = '#604054';
      this.css['font-weight'] = 700;
      this.css['font-size'] = '33px';
    }
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  .DonationBox {
    height: 100%;
    padding: 0 15px;
    font-size: 30px;
  }
</style>
