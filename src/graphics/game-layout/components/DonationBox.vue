<template>
  <div
    class="DonationBox FlexContainer"
    :style="css"
  >
    <span class="Name">{{ name }}</span>&nbsp;<span class="Amount">${{ amount }}</span>
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
        color: 'white',
      },
    };
  },
  created() {
    const colours = [
      { background: '#321c4f', text: 'white' },
      { background: '#281643', text: 'white' },
      { background: '#432756', text: 'white' },
      { background: '#502f59', text: 'white' },
      { background: '#53354d', text: 'white' },
      { background: '#714e5a', text: 'white' },
      { background: '#936e59', text: 'white' },
      { background: '#d1b443', text: 'black' },
      { background: '#fbd93f', text: 'black' },
      { background: '#e7cf5f', text: 'black' },
    ];

    // chosen by fair dice roll.
    // guaranteed to be random.
    let rand = 0;
    if (this.amount < 150) {
      rand = Math.floor(((this.amount - 20) / 130) * colours.length);
    } else {
      rand = colours.length - 1;
    }

    this.css['background-color'] = colours[rand].background;
    this.css.color = colours[rand].text;
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

  .DonationBox > .Amount {
    font-weight: 500;
  }

  .DonationBox > .Name {
    font-weight: 500;
    font-style: italic;
  }
</style>
