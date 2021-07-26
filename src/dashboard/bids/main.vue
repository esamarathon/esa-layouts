<template>
  <v-app>
    <div v-if="!bidsSorted.length" class="pa-3 font-italic">
      No open bids available.
    </div>
    <template v-else>
      <div class="d-flex">
        <v-spacer />
        <v-radio-group v-model="sortOpt" row class="pa-0 ma-0" hide-details label="Sort By">
          <v-radio label="Name" :value="0" />
          <v-radio label="End Time" :value="1" class="mr-0" />
        </v-radio-group>
      </div>
      <v-text-field
        class="mt-2"
        v-model="searchTerm"
        filled
        clearable
        label="Search..."
        append-icon="mdi-magnify"
        :messages="`
          ${bidsFiltered.length} bid${bidsFiltered.length === 1 ? '' : 's'} found.
        `"
      />
      <div :style="{ height: '350px', 'overflow-y': 'scroll' }">
        <bid
          v-for="(bid, i) in bidsFiltered"
          :key="bid.id"
          :bid="bid"
          :index="i"
        />
      </div>
    </template>
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { Bids } from '@esa-layouts/types/schemas';
import { sortBy } from 'lodash';
import { Vue, Component } from 'vue-property-decorator';
import Bid from './components/Bid.vue';

@Component({
  components: {
    Bid,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.bids) readonly bids!: Bids;
  sortOpt = 1;
  searchTerm: string | null = null;

  get bidsSorted(): Bids {
    if (this.sortOpt === 1) {
      return sortBy(this.bids, ['endTime']);
    }
    return sortBy(this.bids, ['game']);
  }

  get bidsFiltered(): Bids {
    return this.bidsSorted.filter((b) => {
      const str = (this.searchTerm) ? this.searchTerm.toLowerCase() : '';
      return !str || (str && (b.game?.toLowerCase().includes(str)
        || b.name.toLowerCase().includes(str)));
    });
  }
}
</script>
