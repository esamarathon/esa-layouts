<template>
  <div
    id="IntermissionHosts"
    class="Flex"
  >
    <host-info pos="left"></host-info>
    <host-info pos="midleft"></host-info>
    <host-info pos="middle"></host-info>
    <host-info pos="midright"></host-info>
    <host-info pos="right"></host-info>
  </div>
</template>

<script>
import HostInfo from './components/HostInfo.vue';

export default {
  name: 'IntermissionHosts',
  components: {
    HostInfo,
  },
};
</script>

<style>
  #IntermissionHosts {
    box-sizing: border-box;
    color: var(--font-colour-inverted);
    position: fixed;
    width: 1920px;
    height: 1000px;
    justify-content: space-evenly;
    align-items: flex-end;
    padding: 50px;
  }
</style>
