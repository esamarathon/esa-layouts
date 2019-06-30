<template>
  <div id="app">
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
  #app {
    position: fixed;
    width: 1920px;
    height: 80px;
    background-image: url('./background-gradient.png');
    text-align: center;
  }
</style>
