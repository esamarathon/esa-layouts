<template>
  <div
    class="Logo FlexContainer"
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
  @import url('../../_misc/components/FlexContainer.css');

  .Logo {
    position: fixed;
  }

  .Logo > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
