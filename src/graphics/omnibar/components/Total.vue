<template>
  <div
    id="Total"
    class="Flex"
  >
    <span
      v-for="(char, i) in totalSplitString"
      :key="i"
      :class="(char === ',' ? 'Comma' : undefined)"
    >
      {{ char }}
    </span>
  </div>
</template>

<script>
import { TweenLite } from 'gsap';

const totalRep = nodecg.Replicant('donationTotal');
const sfxElem = new Audio(require('./sfx/smb3_coin.wav')); // eslint-disable-line global-require

async function playSound() {
  try {
    sfxElem.volume = 1;
    await sfxElem.play();
  } catch (err) {
    // console.log(err);
  }
}
playSound();

export default {
  name: 'Total',
  data() {
    return {
      init: false,
      total: -1,
      tweenedTotal: -1,
      totalSplitString: [],
    };
  },
  watch: {
    async total(val) {
      if (this.init) {
        playSound();
        await new Promise((res) => setTimeout(res, 500));
        TweenLite.to(this.$data, 5, { tweenedTotal: val });
      } else {
        this.tweenedTotal = this.total;
        this.init = true;
      }
    },
    tweenedTotal(val) {
      const string = `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      this.totalSplitString = string.split('');
    },
  },
  mounted() {
    totalRep.on('change', (newVal) => {
      this.total = newVal;
    });
  },
};
</script>

<style scoped>
  #Total {
    padding: 0 13px 0 0;
    font-size: 40px;
    font-weight: 500;
    min-width: 50px;
    text-align: center;
  }

  /* Each character in the total is in a span; setting width so the numbers appear monospaced. */
  #Total > span {
    display: inline-block;
    width: 0.45em;
    text-align: center;
  }
  #Total > .Comma {
    display: inline-block;
    width: 0.22em;
    text-align: center;
  }
</style>
