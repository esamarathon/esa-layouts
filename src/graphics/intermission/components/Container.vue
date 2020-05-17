<template>
  <div
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
      <slot name="header" />
    </div>
    <div
      class="Content FlexColumn"
      :style="{
        width: '100%',
        flex: 1,
      }"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class extends Vue {}
</script>
