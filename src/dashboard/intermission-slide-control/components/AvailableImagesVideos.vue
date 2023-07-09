<template>
  <div>
    <v-toolbar-title>
      Available Images/Videos
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <media-card
        v-if="!media.length"
        :style="{
          'font-style': 'italic',
          'white-space': 'unset',
        }"
      >
        Add images/videos under "Assets" > "{{ bundleName }}" > "Intermission Slide Images/Videos".
      </media-card>
      <draggable
        v-else
        :list="media"
        :group="{ name: 'intermission', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
      >
        <media-card
          v-for="asset in media"
          :key="asset.sum"
          :title="asset.name"
        >
          {{ asset.name }}
        </media-card>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import NodeCGTypes from '@nodecg/types';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import MediaCard from '@esa-layouts/_misc/components/MediaCard.vue';
import { v4 as uuid } from 'uuid';
import { Component, Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';

@Component({
  components: {
    Draggable,
    MediaCard,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.assetsIntermissionSlides)
  readonly media!: NodeCGTypes.AssetFile[];
  bundleName = nodecg.bundleName;

  clone(original: NodeCGTypes.AssetFile): IntermissionSlides['rotation'][0] {
    return {
      type: 'Media',
      id: uuid(),
      mediaUUID: original.sum,
    };
  }
}
</script>
