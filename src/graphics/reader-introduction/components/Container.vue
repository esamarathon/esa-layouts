<template>
  <div
    class="FlexColumn"
    :style="{
      'font-size': '30px',
      'text-align': 'center',
      width: '100%',
    }"
  >
    <div
      class="Header Flex"
      :style="{
        width: '100%',
        padding: '5px 0',
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
        padding: '15px 0',
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
