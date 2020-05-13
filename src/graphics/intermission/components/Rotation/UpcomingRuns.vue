<template>
  <div
    class="Flex"
    :style="{
      position: 'absolute',
      height: '100%',
      width: '100%',
      'flex-direction': 'column',
      'justify-content': 'space-around',
    }"
  >
    <upcoming-run
      v-for="i in [1, 2, 3]"
      :key="i"
      :slot-no="i"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UpcomingRun from '../UpcomingRun.vue';

@Component({
  components: {
    UpcomingRun,
  },
})
export default class extends Vue {
  mounted(): void {
    window.setTimeout(() => this.$emit('end'), 20 * 1000);
  }
}
</script>
