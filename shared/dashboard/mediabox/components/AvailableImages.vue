<template>
  <div>
    <v-toolbar-title>
      Available Images
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <media-card
        v-if="!images.length"
        :style="{
          'font-style': 'italic',
          'white-space': 'unset',
        }"
      >
        Add images under "Assets" > "{{ bundleName }}" > "Media Box Images".
      </media-card>
      <draggable
        v-else
        :list="images"
        :group="{ name: 'media', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
      >
        <media-card
          v-for="image in images"
          :key="image.sum"
          :title="image.name"
        >
          {{ image.name }}
        </media-card>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import type NodeCGTypes from '@nodecg/types';
import { Component, Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { State } from 'vuex-class';
import { MediaBox } from '../../../types';
import MediaCard from './MediaCard.vue';
import { clone } from './shared';

@Component({
  components: {
    Draggable,
    MediaCard,
  },
})
export default class extends Vue {
  @State images!: NodeCGTypes.AssetFile[];
  bundleName = nodecg.bundleName;

  clone(original: NodeCGTypes.AssetFile): MediaBox.RotationElem {
    return clone('image', original.sum);
  }
}
</script>
