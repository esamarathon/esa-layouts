<template>
  <v-app>
    <span class="text-h6">Rotation</span>
    <component
      v-for="item in localRotation"
      :key="item.id"
      :is="item.type"
      v-bind="item.props"
    />
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { Omnibar } from '@esa-layouts/types/schemas';
import { Vue, Component } from 'vue-property-decorator';
import clone from 'clone';
import GenericMsg from './components/GenericMsg.vue';
import Bid from './components/Bid.vue';
import Milestone from './components/Milestone.vue';
import Prize from './components/Prize.vue';
import UpcomingRun from './components/UpcomingRun.vue';

@Component({
  components: {
    GenericMsg,
    Bid,
    Milestone,
    Prize,
    UpcomingRun,
  },
})
export default class IntermissionControl extends Vue {
  @replicantNS.State((s) => s.reps.omnibar) readonly omnibar!: Omnibar;
  localRotation: Omnibar['rotation'] = [];

  created(): void {
    this.localRotation = clone(this.omnibar.rotation);
  }
}
</script>
