<template>
  <div
    class="DonationBox Flex"
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
      const shades = ['#010d30'];
      this.css.color = '#ffffff';
      const rand = Math.floor(Math.random() * shades.length);
      this.css['background-color'] = shades[rand];
    } else if (this.amount < 100 && this.amount >= 50) {
      const shades = ['#4d83aa'];
      const rand = Math.floor(Math.random() * shades.length);
      this.css['background-color'] = shades[rand];
      this.css.color = '#ffffff';
      this.css['font-weight'] = 600;
    } else {
      this.css['background-color'] = '#68b4ea';
      this.css.color = '#353535';
      this.css['font-weight'] = 700;
      this.css['font-size'] = '33px';
    }
  },
};
</script>

<style scoped>
  .DonationBox {
    height: 100%;
    padding: 0 15px;
    font-size: 30px;
  }
</style>
