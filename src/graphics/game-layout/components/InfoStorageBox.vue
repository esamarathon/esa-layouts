<template>
  <div
    id="InfoStorageBox"
    class="FlexContainer"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InfoStorageBox',
};
</script>

<style>
  @import url('./FlexContainer.css');

  #InfoStorageBox {
    position: fixed;
    box-sizing: border-box;
    align-items: flex-start;
  }
</style>
