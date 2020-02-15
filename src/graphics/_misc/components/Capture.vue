<template>
  <div class="Capture">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Capture',
};
</script>

<style scoped>
  .Capture {
    box-sizing: border-box;
    position: fixed;
  }
</style>
