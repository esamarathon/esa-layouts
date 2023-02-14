<template>
  <div>
    <v-toolbar-title>
      Rotation
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <media-card
        v-if="!localRotation.length"
        :style="{ 'font-style': 'italic' }"
      >
        Drag elements from above to here to configure.
      </media-card>
      <draggable
        v-model="localRotation"
        group="intermission"
      >
        <media-card
          v-for="media in localRotation"
          :key="media.id"
          class="d-flex"
        >
          <div
            class="d-flex align-center justify-center flex-grow-1"
            :style="{ 'overflow': 'hidden' }"
          >
            {{ name(media) }}
          </div>
          <div class="d-flex">
            <v-icon @click="del(media.id)">
              mdi-delete
            </v-icon>
          </div>
        </media-card>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import MediaCard from '@esa-layouts/_misc/components/MediaCard.vue';
import { Component, Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { storeModule } from '../store';

@Component({
  components: {
    Draggable,
    MediaCard,
  },
})
export default class extends Vue {
  get localRotation(): IntermissionSlides['rotation'] { return storeModule.localRotation; }

  set localRotation(val: IntermissionSlides['rotation']) {
    storeModule.setLocalRotation({ val, manual: true });
  }

  name(media: IntermissionSlides['rotation'][0]): string {
    let str = '';
    if (media.type === 'Media') {
      str = storeModule.reps.assetsIntermissionSlides
        .find((a) => a.sum === media.mediaUUID)?.name || '';
    } else if (media.type === 'UpcomingRuns') {
      str = 'Upcoming Runs';
    } else if (media.type === 'RandomBid') {
      str = 'Random Bid';
    } else if (media.type === 'RandomPrize') {
      str = 'Random Prize';
    }
    return str || '?';
  }

  del(id: string): void {
    storeModule.deleteItem(id);
  }
}
</script>
