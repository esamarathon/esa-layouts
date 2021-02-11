<template>
  <div
    id="Total"
    class="Flex"
  >
    <audio ref="SFX">
      <source
        src="./sfx/mario_coin.mp3"
        type="audio/mpeg"
      >
    </audio>
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
        this.playSound();
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
  async mounted() {
    totalRep.on('change', (newVal) => {
      this.total = newVal;
    });

    // Keep the SFX playing constantly but on mute to avoid garbage collection (hopefully).
    this.$refs.SFX.muted = true;
    await this.$refs.SFX.play();
    this.$refs.SFX.addEventListener('ended', async () => {
      this.$refs.SFX.muted = true;
      await this.$refs.SFX.play();
    });
  },
  methods: {
    async playSound() {
      try {
        await this.$refs.SFX.pause();
        this.$refs.SFX.currentTime = 0;
        await this.$refs.SFX.play();
        this.$refs.SFX.muted = false;
      } catch (err) {
        // catch
      }
    },
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
