<template>
  <div
    id="StaticLogo"
    class="FlexContainer"
  >
    <img
      id="Cube"
      src="../logo.png"
    >
  </div>
</template>

<script>
export default {
  name: 'StaticLogo',
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  #StaticLogo {
    height: 100%;
    padding: 0 7px;
  }
</style>
