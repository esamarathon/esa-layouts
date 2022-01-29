<template>
  <div :style="{ height: '100%', overflow: 'hidden' }">
    <!-- Goal -->
    <goal v-if="bid && !bid.war" :bid="bid" :seconds="seconds" @end="end" />
    <!-- Wars -->
    <template v-else-if="bid">
      <!-- If we have exactly 2 options, it's a 1v1 bid war. -->
      <war1v1
        v-if="bid.options.length === 2 && !bid.allowUserOptions"
        :bid="bid"
         :seconds="seconds"
        @end="end"
      />
      <war-other v-else :bid-original="bid" :seconds="seconds" @end="end" />
    </template>
  </div>
</template>

<script lang="ts">
import { Bids } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop } from 'vue-property-decorator';
import Goal from './Bid/Goal.vue';
import War1v1 from './Bid/War-1v1.vue';
import WarOther from './Bid/War-Other.vue';

@Component({
  name: 'Bid',
  components: {
    Goal,
    War1v1,
    WarOther,
  },
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly bid!: Bids[0];

  end(): void {
    this.$emit('end');
  }
}
</script>
