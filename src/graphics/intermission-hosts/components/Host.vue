<template>
  <div
    v-if="users && users.hosts && users.hosts[pos]"
    class="Flex"
    :style="{
      'background-color': 'rgba(0,0,0,0.5)',
      height: '50px',
      padding: '15px',
      'font-size': '40px',
    }"
  >
    {{ users.hosts[pos].display_name }}
    <img
      v-if="users.hosts[pos].country_code"
      :key="users.hosts[pos].country_code"
      :src="`/bundles/esa-layouts/flags/${users.hosts[pos].country_code.toLowerCase()}.png`"
      :style="{
        height: '100%',
        'padding-left': '10px',
      }"
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Users } from '../store';

@Component
export default class extends Vue {
  @State users!: Users;
  @Prop({
    default: 'middle',
    validator: (v: string) => ['left', 'midleft', 'middle', 'midright', 'right'].includes(v),
  }) pos!: string;
}
</script>
