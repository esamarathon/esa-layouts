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
    <!-- All Prizes -->
    <draggable
      v-else
      :list="prizes"
      :group="{ name: 'media', pull: 'clone', put: false }"
      :sort="false"
      :clone="clone"
    >
      <media-card
        v-for="prize in prizes"
        :key="prize.id"
        class="d-flex"
      >
        <applicable-icon :is-applicable="isPrizeApplicable(prize)" />
        <div
          class="flex-grow-1"
          :title="prize.name"
        >
          {{ prize.name }}
        </div>
      </media-card>
    </draggable>

    <!-- Generic Prize Slide -->
    <draggable
      :list="['generic_prize']"
      :group="{ name: 'media', pull: 'clone', put: false }"
      :sort="false"
      :clone="cloneGeneric"
    >
      <media-card
        key="generic_prize"
        class="d-flex"
        :style="{ 'font-weight': '500' }"
      >
        <applicable-icon :is-applicable="!!prizes.filter((p) => isPrizeApplicable(p)).length" />
        <div
          class="flex-grow-1"
          title="Generic Prize Slide"
        >
          Generic Prize Slide
        </div>
      </media-card>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Draggable from 'vuedraggable';
import { Tracker, MediaBox } from 'types';
import { Prizes } from 'schemas';
import { clone, isPrizeApplicable } from './shared';
import MediaCard from '../../_misc/components/MediaCard.vue';
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

  clone(original: Tracker.FormattedPrize): MediaBox.RotationElem {
    return clone('prize', original.id.toString());
  }

  cloneGeneric(): MediaBox.RotationElem {
    return clone('prize_generic');
  }
}
</script>
