<template>
  <v-app>
    <!-- Available Images -->
    <v-toolbar-title>
      Available Images
    </v-toolbar-title>
    <v-card
      v-if="!images.length"
      :style="{
        'text-align': 'center',
        padding: '5px',
        'margin-top': '10px',
        'font-style': 'italic',
      }"
    >
      Add images in the "Assets" tab.
    </v-card>
    <draggable
      v-else
      :list="images"
      :group="{ name: 'media', pull: 'clone', put: false }"
      :sort="false"
      :clone="cloneImage"
    >
      <v-card
        v-for="image in images"
        :key="image.sum"
        :style="{ 'text-align': 'center', padding: '5px', 'margin-top': '10px' }"
      >
        {{ image.name }}
      </v-card>
    </draggable>

    <!-- Available Prizes -->
    <v-toolbar-title :style="{ 'margin-top': '20px' }">
      Available Prizes
    </v-toolbar-title>
    <v-card
      v-if="!prizes.length"
      :style="{
        'text-align': 'center',
        padding: '5px',
        'margin-top': '10px',
        'font-style': 'italic',
      }"
    >
      No prizes available from the tracker.
    </v-card>
    <template v-else>
      <draggable
        :list="prizes"
        :group="{ name: 'media', pull: 'clone', put: false }"
        :sort="false"
        :clone="clonePrize"
      >
        <v-card
          v-for="prize in prizes"
          :key="prize.id"
          :style="{ 'text-align': 'center', padding: '5px', 'margin-top': '10px' }"
        >
          {{ prize.name }}
        </v-card>
      </draggable>
    </template>

    <!-- Editable list of media in the rotation. -->
    <v-toolbar-title :style="{ 'margin-top': '20px' }">
      Rotation
    </v-toolbar-title>
    <v-card
      v-if="!newRotation.length"
      :style="{
        'text-align': 'center',
        padding: '5px',
        'margin-top': '10px',
        'font-style': 'italic',
      }"
    >
      Drag elements from above to here to configure.
    </v-card>
    <draggable
      v-model="newRotation"
      group="media"
    >
      <v-card
        v-for="(media, i) in newRotation"
        :key="media.id"
        :style="{ 'text-align': 'center', padding: '5px', 'margin-top': '10px' }"
        class="d-flex"
      >
        <div
          class="flex-grow-1 d-flex align-center justify-start"
          :style="{ 'padding-left': '5px' }"
        >
          {{ getMediaDetails(media).name }}
        </div>
        <v-text-field
          v-model="media.seconds"
          class="pa-0 ma-0 flex-shrink-1"
          type="number"
          hide-details
          dense
          :style="{ 'max-width': '50px' }"
          @input="parseSeconds(i)"
        />
        <v-icon
          @click="remove(i)"
        >
          mdi-delete
        </v-icon>
      </v-card>
    </draggable>

    <!-- Save Button -->
    <v-btn
      :loading="disableSave"
      :disabled="disableSave"
      :style="{ 'margin-top': '20px' }"
      @click="save()"
    >
      Save
    </v-btn>

    <!-- Information on current media, displayed at the bottom. -->
    <div
      v-if="!settings.current"
      :style="{
        'text-align': 'center',
        padding: '5px',
        'margin-top': '10px',
        'font-style': 'italic',
      }"
    >
      No media currently in rotation.
    </div>
    <div
      v-else
      :style="{
        'text-align': 'center',
        padding: '5px',
        'margin-top': '10px',
      }"
    >
      <span class="font-weight-bold">Current:</span>
      {{ getMediaDetails(settings.current).name }}
      <br>(position {{ currentPosition }}/{{ settings.rotation.length }},
      {{ Math.round(getLength(settings.current.id)
        - (settings.current.timeElapsed / 1000)) }}/{{ getLength(settings.current.id) }}s left)
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Action, Mutation } from 'vuex-class';
import Draggable from 'vuedraggable';
import { Asset, Tracker } from 'types';
import clone from 'clone';
import { v4 as uuid } from 'uuid';
import { MediaBox, Prizes } from 'schemas';
import { Save, UpdateNewRotation } from './store';

@Component({
  components: {
    Draggable,
  },
})
export default class extends Vue {
  @State images!: Asset[];
  @State prizes!: Prizes;
  @State settings!: MediaBox;
  @State disableSave!: boolean;
  @State('newRotation') newRotationState!: MediaBox['rotation'];
  @Mutation updateNewRotation!: UpdateNewRotation;
  @Action save!: Save;

  get newRotation(): MediaBox['rotation'] {
    return this.newRotationState;
  }
  set newRotation(val) {
    this.updateNewRotation(val);
  }

  getLength(id: string): number {
    return this.settings.rotation.find((i) => i.id === id)?.seconds || 0;
  }

  created(): void {
    this.newRotation = clone(this.settings.rotation);
  }

  cloneImage(original: Asset): MediaBox['rotation'][0] {
    return this.clone('image', original.sum);
  }

  clonePrize(original: Tracker.FormattedPrize): MediaBox['rotation'][0] {
    return this.clone('prize', original.id.toString());
  }

  clone(type: 'image' | 'prize', mediaUUID: string): MediaBox['rotation'][0] {
    return {
      type,
      id: uuid(),
      mediaUUID,
      seconds: 60,
    };
  }

  get currentPosition(): number {
    const indexID = this.settings.rotation
      .findIndex((i) => i.id === this.settings.current?.id);
    return indexID >= 0 ? indexID + 1 : ((this.settings.current?.index || -1) + 1);
  }

  getMediaDetails(media: MediaBox['rotation'][0]): { name?: string } {
    let details: Asset | Tracker.FormattedPrize | undefined;
    if (media.type === 'image') {
      details = this.images.find((l) => l.sum === media.mediaUUID);
    } else if (media.type === 'prize') {
      details = this.prizes.find((p) => p.id.toString() === media.mediaUUID);
    }
    return details ? {
      name: details.name,
    } : {};
  }

  parseSeconds(i: number): void {
    this.newRotation[i].seconds = Number(this.newRotation[i].seconds);
  }

  remove(i: number): void {
    this.newRotation.splice(i, 1);
  }
}
</script>
