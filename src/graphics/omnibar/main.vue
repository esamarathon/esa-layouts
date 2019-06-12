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

<style lang="css">
  body {
    font-family: 'Barlow Condensed', sans-serif;
    color: white;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    position: fixed;
    width: 1920px;
    height: 80px;
    background-color: #56b983;
    text-align: center;
  }
</style>
