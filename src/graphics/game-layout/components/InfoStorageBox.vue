<template>
  <div
    class="InfoStorageBox FlexContainer"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InfoStorageBox',
};
</script>

<style scoped>
  @import url('./FlexContainer.css');

  .InfoStorageBox {
    margin-top: 5px;
    position: fixed;
    box-sizing: border-box;
    justify-content: flex-start;
    flex-direction: column;
  }
</style>
