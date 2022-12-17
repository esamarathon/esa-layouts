<template>
  <div
    v-if="donationReader || (theme == 'swcf' && comms.length)"
    class="Flex DonationReader"
    :style="{ height: '100%' }"
  >
    <div
      class="Flex Mic"
      :style="{
        'box-sizing': 'border-box',
        height: '100%',
        padding: '5px'
      }"
    >
      <img
        src="./Mic.png"
        :style="{ height: '100%' }"
      >
    </div>
    <div
      :style="{
        display: 'flex',
        padding: '0 15px',
      }"
    >
      <template v-if="theme === 'swcf'">
        <span v-for="({ name, pronouns }, i) in comms" :key="i">
          {{ name }}<span v-if="pronouns" class="Pronouns PronounsComms">
            {{ pronouns }}</span><template v-if="i < comms.length - 1">,&nbsp;</template>
        </span>
      </template>
      <template v-else>
        {{ name }}
        <div
          v-if="pronouns"
          class="Pronouns"
          :style="{
            padding: '3px 5px',
            'margin-left': '10px',
          }"
        >
          {{ pronouns }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Commentators, Configschema, DonationReader } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class extends Vue {
  @State readonly commentators!: Commentators;
  @State donationReader!: DonationReader;
  theme = (nodecg.bundleConfig as Configschema).event.theme;

  // For SWCF
  get comms(): { name: string, pronouns?: string }[] {
    return this.commentators.map((c) => ({
      name: c.replace(/\((.*?)\)/g, '').trim(),
      pronouns: (c.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, ''),
    }));
  }

  get name(): string | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return this.donationReader.replace(/\((.*?)\)/g, '').trim();
  }

  get pronouns(): string | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return (this.donationReader.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, '');
  }
}
</script>

<style scoped>
  .PronounsComms {
    position: relative;
    display: inline-block;
    font-weight: 400;
    font-size: 0.75em;
    top: -0.1em;
    line-height: 1.5em;
    color: #cccccc;
    text-transform: uppercase;
    padding: 0 3px;
    margin-left: 3px;
  }
</style>
