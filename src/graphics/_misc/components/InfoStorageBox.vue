<template>
  <div
    class="InfoStorageBox Flex"
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
  .InfoStorageBox {
    position: fixed;
    box-sizing: border-box;
    justify-content: flex-start;
    flex-direction: column;
  }
</style>
