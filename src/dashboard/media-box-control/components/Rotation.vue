<template>
  <div>
    <v-toolbar-title>
      Rotation
    </v-toolbar-title>
    <media-card
      v-if="!newRotation.length"
      :style="{ 'font-style': 'italic' }"
    >
      Drag elements from above to here to configure.
    </media-card>
    <draggable
      v-model="newRotation"
      group="media"
    >
      <media-card
        v-for="(media, i) in newRotation"
        :key="media.id"
        class="d-flex"
      >
        <applicable-icon :is-applicable="isApplicable(media)" />
        <div
          class="d-flex align-center justify-center flex-grow-1"
          :title="getMediaDetails(media).name"
          :style="{
            'overflow': 'hidden',
            'font-weight': media.type === 'prize_generic' ? '500' : undefined,
            'font-style': !getMediaDetails(media).name ? 'italic' : undefined,
          }"
        >
          {{ getMediaDetails(media).name || 'Could not find media name.' }}
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="media.seconds"
            class="pa-0 ma-0"
            type="number"
            hide-details
            dense
            :style="{ 'width': '40px !important' }"
            @input="parseSeconds(i)"
          />
          <v-icon @click="remove(i)">
            mdi-delete
          </v-icon>
        </div>
      </media-card>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { State2Way } from 'vuex-class-state2way';
import Draggable from 'vuedraggable';
import clone from 'clone';
import { Prizes, MediaBox as MediaBoxRep } from 'schemas';
import { Asset, MediaBox } from 'types';
import MediaCard from '../../_misc/components/MediaCard.vue';
import ApplicableIcon from './ApplicableIcon.vue';
import { getMediaDetails, isPrizeApplicable } from './shared';

@Component({
  components: {
    Draggable,
    MediaCard,
    ApplicableIcon,
  },
})
export default class extends Vue {
  @State images!: Asset[];
  @State prizes!: Prizes;
  @State settings!: MediaBoxRep;
  @State2Way('updateNewRotation', 'newRotation') newRotation!: MediaBox.RotationElem[];
  getMediaDetails = getMediaDetails;
  isPrizeApplicable = isPrizeApplicable;

  created(): void {
    this.newRotation = clone(this.settings.rotation);
  }

  isApplicable(media: MediaBox.RotationElem): boolean {
    // Only applicable if the asset actually exists.
    if (media.type === 'image') {
      return !!this.images.find((i) => i.sum === media.mediaUUID);
    }
    // Generic prize element only applicable if there are applicable prizes to fill it with.
    if (media.type === 'prize_generic') {
      return !!this.prizes.filter((p) => isPrizeApplicable(p)).length;
    }
    // Check if prize is applicable using other function.
    if (media.type === 'prize') {
      return isPrizeApplicable(this.prizes.find((p) => p.id.toString() === media.mediaUUID));
    }
    return false;
  }

  parseSeconds(i: number): void {
    this.newRotation[i].seconds = Number(this.newRotation[i].seconds);
  }

  remove(i: number): void {
    this.newRotation.splice(i, 1);
  }
}
</script>
