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
        'background-color': '#a84300',
        color: '#ffffff',
        'font-weight': 500,
        'font-size': '30px',
      },
    };
  },
  created() {
    if (this.amount < 50) {
      this.css['background-color'] = '#a8430060';
    } else if (this.amount < 100 && this.amount >= 50) {
      this.css['background-color'] = '#a8430080';
      this.css.color = '#ffffff';
      this.css['font-weight'] = 600;
    } else {
      this.css['background-color'] = '#a84300';
      this.css.color = '#ffffff';
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
