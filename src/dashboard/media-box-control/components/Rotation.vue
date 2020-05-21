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
          }"
        >
          {{ getMediaDetails(media).name }}
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
import { State, Mutation } from 'vuex-class';
import Draggable from 'vuedraggable';
import clone from 'clone';
import { MediaBox, Prizes } from 'schemas';
import MediaCard from './MediaCard.vue';
import ApplicableIcon from './ApplicableIcon.vue';
import { UpdateNewRotation } from '../store';
import { getMediaDetails, isPrizeApplicable } from './shared';

@Component({
  components: {
    Draggable,
    MediaCard,
    ApplicableIcon,
  },
})
export default class extends Vue {
  @State prizes!: Prizes;
  @State('newRotation') newRotationState!: MediaBox['rotation'];
  @Mutation updateNewRotation!: UpdateNewRotation;
  @State settings!: MediaBox;
  getMediaDetails = getMediaDetails;
  isPrizeApplicable = isPrizeApplicable;

  created(): void {
    this.newRotation = clone(this.settings.rotation);
  }

  get newRotation(): MediaBox['rotation'] {
    return this.newRotationState;
  }
  set newRotation(val) {
    this.updateNewRotation(val);
  }

  isApplicable(media: MediaBox['rotation'][0]): boolean {
    if (media.type !== 'prize') {
      return true;
    }
    const prize = this.prizes.find((p) => p.id.toString() === media.mediaUUID);
    return prize ? isPrizeApplicable(prize) : false;
  }

  parseSeconds(i: number): void {
    this.newRotation[i].seconds = Number(this.newRotation[i].seconds);
  }

  remove(i: number): void {
    this.newRotation.splice(i, 1);
  }
}
</script>
