<template>
  <div
    id="SubGoalMet"
    class="Flex"
  >
    <img
      src="../hyperx.png"
      :style="{ width: '100%' }"
    >
    <div :style="{ 'font-size': '20px' }">
      SUB GOAL MET!
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubGoalMet',
};
</script>

<style scoped>
  #SubGoalMet {
    font-weight: 500;
    width: 120px;
    text-align: center;
    flex-direction: column;
  }
</style>
