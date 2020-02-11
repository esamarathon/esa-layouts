<template>
  <v-app>
    <v-toolbar-title>
      Available Logos
    </v-toolbar-title>
    <v-card
      v-if="!logos.length"
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
      :list="logos"
      :group="{ name: 'logos', pull: 'clone', put: false }"
      :sort="false"
      :clone="cloneLogo"
    >
      <v-card
        v-for="logo in logos"
        :key="logo.sum"
        :style="{ 'text-align': 'center', padding: '5px', 'margin-top': '10px' }"
      >
        {{ logo.name }}
      </v-card>
    </draggable>
    <v-toolbar-title :style="{ 'margin-top': '20px' }">
      Logo Rotation
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
      Drag logos from above to here to configure.
    </v-card>
    <draggable
      v-model="newRotation"
      group="logos"
    >
      <v-card
        v-for="(logo, i) in newRotation"
        :key="logo.id"
        :style="{ 'text-align': 'center', padding: '5px', 'margin-top': '10px' }"
        class="d-flex"
      >
        <div
          class="flex-grow-1 d-flex align-center justify-start"
          :style="{ 'padding-left': '5px' }"
        >
          {{ getAssetDetails(logo.sum).name }}
        </div>
        <v-text-field
          v-model="logo.seconds"
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
    <v-btn
      :loading="disableSave"
      :disabled="disableSave"
      :style="{ 'margin-top': '20px' }"
      @click="save()"
    >
      Save
    </v-btn>
    <div
      v-if="!settings.current"
      :style="{
        'text-align': 'center',
        padding: '5px',
        'margin-top': '10px',
        'font-style': 'italic',
      }"
    >
      No sponsor logo currently in rotation.
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
      {{ getAssetDetails(settings.current.sum).name }}
      <br>(position {{ currentPosition }}/{{ settings.rotation.length }},
      {{ timeLeft }}/{{ getLength(settings.current.id) }}s left)
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Action, Mutation } from 'vuex-class';
import Draggable from 'vuedraggable';
import { Asset } from 'types';
import clone from 'clone';
import uuid from 'uuid/v4';
import { SponsorLogos } from 'schemas';
import { Save, UpdateNewRotation } from './store';

@Component({
  components: {
    Draggable,
  },
})
export default class extends Vue {
  @State logos!: Asset[];
  @State settings!: SponsorLogos;
  @State disableSave!: boolean;
  @State('newRotation') newRotationState!: SponsorLogos['rotation'];
  @Mutation updateNewRotation!: UpdateNewRotation;
  @Action save!: Save;
  timeLeft = 0;

  get newRotation(): SponsorLogos['rotation'] {
    return this.newRotationState;
  }
  set newRotation(val) {
    this.updateNewRotation(val);
  }

  getLength(id: string): number {
    return this.settings.rotation.find((i) => i.id === id)?.seconds || 0;
  }

  updateTimeLeft(): void {
    if (this.settings.current) {
      this.timeLeft = Math.floor((this.settings.current.timestamp / 1000)
        + this.getLength(this.settings.current.id) - (Date.now() / 1000));
    } else {
      this.timeLeft = 0;
    }
  }

  created(): void {
    this.newRotation = clone(this.settings.rotation);
    this.updateTimeLeft();
    setInterval(this.updateTimeLeft, 1000);
  }

  // eslint-disable-next-line class-methods-use-this
  cloneLogo(original: Asset): SponsorLogos['rotation'][0] {
    return {
      id: uuid(),
      sum: original.sum,
      seconds: 60,
    };
  }

  get currentPosition(): number {
    const indexID = this.settings.rotation
      .findIndex((i) => i.id === this.settings.current?.id);
    return indexID >= 0 ? indexID + 1 : ((this.settings.current?.index || -1) + 1);
  }

  getAssetDetails(sum: string): Asset | {} {
    return this.logos.find((l) => l.sum === sum) || {};
  }

  parseSeconds(i: number): void {
    this.newRotation[i].seconds = Number(this.newRotation[i].seconds);
  }

  remove(i: number): void {
    this.newRotation.splice(i, 1);
  }
}
</script>
