<template>
  <div
    class="Flex"
    :style="{
      'background-color': 'var(--border-colour)',
      width: '100%',
      height: '50px',
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
