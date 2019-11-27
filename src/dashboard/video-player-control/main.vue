<template>
  <v-app>
    <v-radio-group
      v-model="selected"
      hide-details
      class="pa-0 ma-0"
    >
      <v-radio
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :label="opt.text"
      ></v-radio>
    </v-radio-group>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { CurrentLayout, CurrentVideoSum } from 'schemas';
import { Asset } from 'types';
import { UpdateCurrentVideo } from './store';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State currentVideoSum!: CurrentVideoSum;
  @Mutation updateCurrentVideo!: UpdateCurrentVideo;

  get selected(): CurrentLayout {
    return this.currentVideoSum;
  }
  set selected(val) {
    this.updateCurrentVideo(val);
  }

  get options(): { value: string; text: string }[] {
    const opts: { value: string; text: string }[] = [];
    if (this.videos && this.videos.length) {
      this.videos.forEach((video) => {
        opts.push({
          value: video.sum,
          text: video.name,
        });
      });
    }
    return opts;
  }
}
</script>
