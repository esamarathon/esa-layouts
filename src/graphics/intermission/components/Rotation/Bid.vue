<template>
  <div
    v-if="bid"
    class="FlexColumn"
    :style="{
      'font-size': '41px',
      'text-align': 'center',
    }"
  >
    <div
      class="Header Flex"
      :style="{
        width: '100%',
        height: '60px',
        'font-weight': 500,
        'text-transform': 'uppercase',
      }"
    >
      <template v-if="!bid.war">
        Upcoming Goal
      </template>
      <template v-else>
        Upcoming Bid War
      </template>
    </div>
    <div
      class="Content FlexColumn"
      :style="{
        width: '100%',
        flex: 1,
      }"
    >
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
          {{ formatUSD(bid.total) }}/{{ formatUSD(bid.goal) }}
        </template>
        <template v-else>
          <div v-if="bid.options.length">
            <div
              v-for="option in bid.options"
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Tracker } from 'types';
import { formatUSD } from '../../../_misc/helpers';

@Component
export default class extends Vue {
  @State('currentBid') bid!: Tracker.FormattedBid | undefined;
  formatUSD = formatUSD;

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
  .Content > div {
    padding: 10px;
  }
</style>
