<template>
  <div
    class="Logo Flex"
  >
    <img src="./Logo.png">
  </div>
</template>

<script>
export default {
  name: 'Logo',
};
</script>

<style scoped>
  .Logo {
    position: fixed;
  }

  .Logo > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
