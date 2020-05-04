<template>
  <div
    v-if="commentators.length"
    class="Flex"
    :style="{
      'background-color': 'var(--commentators-bg-colour)',
      width: '100%',
      height: '40px', // May need moving out/be a prop
      'font-size': '25px',
      'font-weight': '400',
      color: 'var(--font-colour-inverted)',
    }"
  >
    <span :style="{ 'font-weight': '500' }">
      <template v-if="commentators.length === 1">Commentator:</template>
      <template v-else>Commentators:</template>
    </span>
    &nbsp;{{ commentators.join(', ') }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Commentators } from 'schemas';

@Component
export default class extends Vue {
  @State commentators!: Commentators;
}
</script>
