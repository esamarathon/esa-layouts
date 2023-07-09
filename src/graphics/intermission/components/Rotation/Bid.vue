<template>
  <container v-if="bid">
    <template v-slot:header>
      <template v-if="!bid.war">
        Upcoming Goal
      </template>
      <template v-else>
        Upcoming Bid War
      </template>
    </template>
    <template v-slot:content>
      <div
        v-if="runTitle"
        :style="{ 'font-size': '45px' }"
      >
        {{ runTitle }}
      </div>
      <div :style="{ 'font-size': '32px' }">
        {{ bid.name }}
      </div>
      <div :style="{ 'font-size': '40px' }">
        <template v-if="!bid.war">
          {{ formatUSD(bid.total) }}/{{ bid.goal ? formatUSD(bid.goal) : '?' }}
        </template>
        <template v-else>
          <div v-if="bid.options.length">
            <div
              v-for="option in bid.options.slice(0, 5)"
              :key="`${option.name}${option.total}`"
            >
              {{ option.name }} ({{ formatUSD(option.total) }})
            </div>
            <div v-if="bid.allowUserOptions">
              ...or you could submit your own idea!
            </div>
          </div>
          <div v-else-if="bid.allowUserOptions">
            No options submitted yet, be the first!
          </div>
        </template>
      </div>
    </template>
  </container>
</template>

<script lang="ts">
import { Bids, IntermissionSlides } from '@esa-layouts/types/schemas';
import { Tracker } from '@shared/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { formatUSD } from '../../../_misc/helpers';
import Container from '../Container.vue';

@Component({
  components: {
    Container,
  },
})
export default class extends Vue {
  @State bids!: Bids;
  @Prop({ type: Object, required: true }) readonly current!: IntermissionSlides['current'];
  formatUSD = formatUSD;

  get bid(): Tracker.FormattedBid | undefined {
    return this.bids.find((b) => b.id === this.current?.bidId);
  }

  get runTitle(): string {
    if (this.bid) {
      const arr = [
        this.bid.game || '?',
        this.bid.category,
      ].filter(Boolean);
      return arr.join(' - ');
    }
    return '?';
  }

  mounted(): void {
    // We should always have a bid, this is just a backup in case.
    if (!this.bid) {
      this.$emit('end');
    } else {
      window.setTimeout(() => this.$emit('end'), 20 * 1000);
    }
  }
}
</script>

<style scoped>
  .Content > * {
    padding: 10px 0;
  }
</style>
