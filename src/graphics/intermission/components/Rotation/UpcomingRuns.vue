<template>
  <!-- Transition group example if I choose to change one day. -->
  <!--<transition-group
    tag="div"
    name="runs"
  >-->
  <div
    v-if="nextRuns.slice(1).length"
    class="Flex"
    :style="{
      'flex-direction': 'column',
      'justify-content': 'space-around',
    }"
  >
    <upcoming-run
      v-for="(run, i) in nextRuns.slice(1)"
      :key="run.id"
      :run-data="run"
      :slot-no="i + 1"
    />
  </div>
  <container v-else>
    <template v-slot:header>
      ...And that's the end!
    </template>
    <template v-slot:content>
      <span :style="{ 'font-size': '120px' }">
        No More Runs
        <img
          src="./esaOhNo.png"
          :style="{ height: '1em' }"
        >
      </span>
    </template>
  </container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunData } from 'speedcontrol-util/types';
import UpcomingRun from '../UpcomingRun.vue';
import Container from '../Container.vue';

@Component({
  components: {
    UpcomingRun,
    Container,
  },
})
export default class extends Vue {
  @State nextRuns!: RunData[];

  mounted(): void {
    window.setTimeout(() => this.$emit('end'), 20 * 1000);
  }
}
</script>
