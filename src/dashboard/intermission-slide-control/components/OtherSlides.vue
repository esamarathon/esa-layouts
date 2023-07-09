<template>
  <div>
    <v-toolbar-title>
      Other Slides
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <draggable
        :list="selection"
        :group="{ name: 'intermission', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
      >
        <media-card
          v-for="item in selection"
          :key="item.type"
          :title="item.name"
        >
          {{ item.name }}
        </media-card>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
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
  selection: { type: IntermissionSlides['rotation'][0]['type'], name: string }[] = [
    {
      type: 'UpcomingRuns',
      name: 'Upcoming Runs',
    },
    {
      type: 'RandomBid',
      name: 'Random Bid',
    },
    {
      type: 'RandomPrize',
      name: 'Random Prize',
    },
  ];

  clone(selection: this['selection'][0]): IntermissionSlides['rotation'][0] {
    return {
      type: selection.type,
      id: uuid(),
      mediaUUID: '-1',
    };
  }
}
</script>
