<template>
  <div id="Twitch">
    <span class="Line1">Support the charity by using your Twitch Prime token to subscribe, cheer in chat or make a donation.</span>
    <span class="Line2">All of the revenue received by ESA will go directly towards the Swedish Alzheimer's Foundation.</span>
    <span class="Line3">Together we can hopefully game over Alzheimer's.</span>
    <img
      class="Logo"
      src="./Alzheimerfonden.svg"
    >
    <span class="Line4">Thank you for your support.</span>
  </div>
</template>

<script>
export default {
  name: 'Twitch',
  mounted() {
    setTimeout(() => this.$emit('end'), 20 * 1000);
  },
};
</script>

<style>
  #Twitch {
    box-sizing: border-box;
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: rgba(0,0,0,0.3);
    padding: 0 50px;
    font-weight: 400;
  }

  #Twitch > .Line1 {
    font-size: 40px;
  }
  #Twitch > .Line2 {
    margin-top: 10px;
    font-size: 40px;
  }
  #Twitch > .Line3 {
    margin-top: 10px;
    font-size: 40px;
  }
  #Twitch > .Line4 {
    margin-top: 30px;
    font-size: 50px;
    font-weight: 500;
  }

  #Twitch > .Logo {
    margin-top: 30px;
    height: 200px;
  }
</style>
