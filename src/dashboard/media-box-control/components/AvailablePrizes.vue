<template>
  <div>
    <v-toolbar-title>
      Available Prizes
    </v-toolbar-title>
    <media-card
      v-if="!prizes.length"
      :style="{ 'font-style': 'italic' }"
    >
      No prizes available from the tracker.
    </media-card>
    <template v-else>
      <draggable
        :list="prizes"
        :group="{ name: 'media', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
      >
        <media-card
          v-for="prize in prizes"
          :key="prize.id"
          class="d-flex"
          :title="prize.name"
        >
          <applicable-icon :is-applicable="isPrizeApplicable(prize)" />
          <div class="flex-grow-1">
            {{ prize.name }}
          </div>
        </media-card>
      </draggable>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Draggable from 'vuedraggable';
import { Tracker } from 'types';
import { MediaBox, Prizes } from 'schemas';
import { clone, isPrizeApplicable } from './shared';
import MediaCard from './MediaCard.vue';
import ApplicableIcon from './ApplicableIcon.vue';

@Component({
  components: {
    Draggable,
    MediaCard,
    ApplicableIcon,
  },
})
export default class extends Vue {
  @State prizes!: Prizes;
  isPrizeApplicable = isPrizeApplicable;

  clone(original: Tracker.FormattedPrize): MediaBox['rotation'][0] {
    return clone('prize', original.id.toString());
  }
}
</script>
