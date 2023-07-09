<template>
  <v-app>
    <available-images-videos />
    <!-- Available Prizes -->
    <!-- Available Bids -->
    <!-- Available Goals? -->
    <other-slides :style="{ 'margin-top': '20px' }" />

    <rotation v-model="localRotation" :style="{ 'margin-top': '20px' }" />

    <!-- Save/Revert -->
    <div class="d-flex mt-4">
      <v-btn class="flex-grow-1 mr-2" :disabled="!isEdited" @click="save">
        Save
      </v-btn>
      <v-btn :disabled="!isEdited" @click="setLocalRotationFromGlobal()">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <current-item :style="{ 'margin-top': '20px' }" />
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { Component, Vue, Watch } from 'vue-property-decorator';
import AvailableImagesVideos from './components/AvailableImagesVideos.vue';
import CurrentItem from './components/CurrentItem.vue';
import OtherSlides from './components/OtherSlides.vue';
import Rotation from './components/Rotation.vue';
import { storeModule } from './store';

@Component({
  components: {
    AvailableImagesVideos,
    Rotation,
    OtherSlides,
    CurrentItem,
  },
})
export default class IntermissionSlideControl extends Vue {
  @replicantNS.State((s) => s.reps.intermissionSlides) readonly iSlides!: IntermissionSlides;

  get localRotation(): IntermissionSlides['rotation'] { return storeModule.localRotation; }

  get isEdited(): boolean {
    return storeModule.localEdits;
  }

  setLocalRotationFromGlobal(val?: IntermissionSlides['rotation']): void {
    storeModule.setLocalRotation({ val: clone(val || this.iSlides.rotation) });
  }

  @Watch('omnibar.rotation')
  onGlobalRotationChange(val: IntermissionSlides['rotation']): void {
    if (!storeModule.localEdits) this.setLocalRotationFromGlobal(val);
  }

  created(): void {
    this.setLocalRotationFromGlobal();
  }

  save(): void {
    storeModule.setGlobalRotation(this.localRotation);
  }
}
</script>
