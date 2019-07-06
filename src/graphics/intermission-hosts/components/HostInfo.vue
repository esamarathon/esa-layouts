<template>
  <div
    v-if="show"
    class="HostInfo FlexContainer"
  >
    {{ name }}
    <img
      :key="country"
      class="Flag"
      :style="{ 'display' : showFlag ? '' : 'none' }"
      :src="`/bundles/esa-layouts/static/flags/${country}.png`"
    >
  </div>
</template>

<script>
const users = nodecg.Replicant('users', 'speedcontrol-flagcarrier');

export default {
  name: 'HostInfo',
  props: {
    pos: {
      type: String,
      default: 'middle',
    },
  },
  data() {
    return {
      show: false,
      name: '',
      showFlag: false,
      country: '',
    };
  },
  mounted() {
    users.on('change', (data) => {
      if (data.hosts && data.hosts[this.pos]) {
        this.name = data.hosts[this.pos].display_name;
        this.country = data.hosts[this.pos].country_code.toLowerCase();
        if (this.country) {
          this.showFlag = true;
        } else {
          this.showFlag = false;
        }
        this.show = true;
      } else {
        this.show = false;
      }
    });
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  .HostInfo {
    background-color: rgba(0,0,0,0.5);
    height: 50px;
    padding: 15px;
    font-size: 40px;
  }

  .HostInfo > .Flag {
    height: 100%;
    padding-left: 10px;
  }
</style>
