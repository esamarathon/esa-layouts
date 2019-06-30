<template>
  <div id="Omnibar">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      msg: 'This will be the omnibar soom™.',
    };
  },
};
</script>

<style>
  #Omnibar {
    position: fixed;
    width: 1920px;
    height: 80px;
    text-align: center;
  }
</style>
