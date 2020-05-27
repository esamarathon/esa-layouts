<template>
  <div>
    <v-toolbar-title>
      Available Images
    </v-toolbar-title>
    <media-card
      v-if="!images.length"
      :style="{ 'font-style': 'italic' }"
    >
      Add images in the "Assets" tab.
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
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Draggable from 'vuedraggable';
import { Asset, MediaBox } from 'types';
import { clone } from './shared';
import MediaCard from '../../_misc/components/MediaCard.vue';

@Component({
  components: {
    Draggable,
    MediaCard,
  },
})
export default class extends Vue {
  @State images!: Asset[];

  clone(original: Asset): MediaBox.RotationElem {
    return clone('image', original.sum);
  }
}
</script>
