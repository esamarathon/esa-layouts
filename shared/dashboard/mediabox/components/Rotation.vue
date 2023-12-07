<template>
  <div>
    <!-- Dialog for editing custom text -->
    <v-dialog class="Dialog" v-model="dialog" persistent>
      <v-card>
        <div class="pa-4 pb-0">
          Text entered here can include Markdown for styling purposes.
        </div>
        <v-card-text class="pa-4 pb-0">
          <v-form>
            <v-textarea
              v-model="editedText"
              label="Text"
              autocomplete="off"
              filled
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
        <v-spacer />
        <v-btn @click="save">Save</v-btn>
        <v-btn @click="dialog = false; editedText = ''; editingElem = ''">Cancel</v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
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
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-checkbox
                    v-on="on"
                    v-model="media.showOnIntermission"
                    dense
                    class="ma-0 pa-0"
                    hide-details
                  />
                </div>
              </template>
              <span>Show On Intermission</span>
            </v-tooltip>
            <v-text-field
              v-model="media.seconds"
              class="pa-0 ma-0"
              type="number"
              hide-details
              dense
              :style="{ 'width': '40px !important' }"
              @input="parseSeconds(i)"
            />
            <v-icon
              v-if="media.type === 'text'"
              @click="editingElem = media.id; editedText = media.text || ''; dialog = true"
            >
              mdi-pencil
            </v-icon>
            <v-icon @click="remove(i)">
              mdi-delete
            </v-icon>
          </div>
        </media-card>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import type NodeCGTypes from '@nodecg/types';
import clone from 'clone';
import { Component, Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { State } from 'vuex-class';
import { State2Way } from 'vuex-class-state2way';
import { MediaBox } from '../../../types';
import { MediaBox as MediaBoxRep, Prizes } from '../../../types/schemas';
import ApplicableIcon from './ApplicableIcon.vue';
import MediaCard from './MediaCard.vue';
import { getMediaDetails, isPrizeApplicable } from './shared';

@Component({
  components: {
    Draggable,
    MediaCard,
    ApplicableIcon,
  },
})
export default class extends Vue {
  @State images!: NodeCGTypes.AssetFile[];
  @State prizes!: Prizes;
  @State settings!: MediaBoxRep;
  @State2Way('updateNewRotation', 'newRotation') newRotation!: MediaBox.RotationElem[];
  getMediaDetails = getMediaDetails;
  isPrizeApplicable = isPrizeApplicable;
  dialog = false;
  editingElem = '';
  editedText = '';

  created(): void {
    this.newRotation = clone(this.settings.rotation);
  }

  isApplicable(media: MediaBox.RotationElem): boolean | undefined {
    // TODO: Check if on intermission on the dashboard size.
    // We should probably just be loading in the server applicable rotation here.
    if (!media.showOnIntermission) {
      return undefined;
    }
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
    // Text is always applicable.
    if (media.type === 'text') {
      return true;
    }
    return false;
  }

  parseSeconds(i: number): void {
    this.newRotation[i].seconds = Number(this.newRotation[i].seconds);
  }

  save(): void {
    const index = this.newRotation.findIndex((v) => v.id === this.editingElem);
    if (index >= 0) {
      this.newRotation[index].text = this.editedText;
    }
    this.editedText = '';
    this.editingElem = '';
    this.dialog = false;
  }

  remove(i: number): void {
    this.newRotation.splice(i, 1);
  }
}
</script>
