<template>
  <v-card
    :style="{
      'text-align': 'center',
      padding: '5px',
      'margin-top': '10px',
      'white-space': 'nowrap',
      'overflow': 'hidden',
    }"
  >
    <slot />
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class extends Vue {}
</script>
