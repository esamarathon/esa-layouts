<template>
  <div
    class="Flex"
    :style="{
      'background-color': 'var(--commentators-bg-colour)',
      width: '100%',
      height: '40px',
    }"
  >
    Player Info
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class extends Vue {}
</script>
