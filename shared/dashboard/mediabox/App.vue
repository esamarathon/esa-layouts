<template>
  <v-app>
    <available-images />
    <available-prizes v-if="prizes" :style="{ 'margin-top': '20px' }" />
    <div :style="{ 'margin-top': '20px' }">
      <v-toolbar-title>
        Custom Text Element
      </v-toolbar-title>
      <div>
        <draggable
          :list="['text']"
          :group="{ name: 'media', pull: 'clone', put: false }"
          :sort="false"
          :clone="cloneText"
        >
          <media-card key="text" :style="{ 'font-weight': '500' }">
            Drag to rotation to configure a custom text element.
          </media-card>
        </draggable>
      </div>
    </div>
    <rotation :style="{ 'margin-top': '20px' }" />

    <!-- Save Button -->
    <v-btn
      :loading="disableSave"
      :disabled="disableSave"
      :style="{ 'margin-top': '20px' }"
      @click="save()"
    >
      Save
    </v-btn>

    <current-media-info :style="{ 'margin-top': '10px' }" />
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { Action, State } from 'vuex-class';
import { MediaBox } from '../../types';
import AvailableImages from './components/AvailableImages.vue';
import AvailablePrizes from './components/AvailablePrizes.vue';
import CurrentMediaInfo from './components/CurrentMediaInfo.vue';
import MediaCard from './components/MediaCard.vue';
import Rotation from './components/Rotation.vue';
import { clone } from './components/shared';
import { Save, store } from './store';

@Component({
  store,
  components: {
    Draggable,
    AvailableImages,
    AvailablePrizes,
    Rotation,
    CurrentMediaInfo,
    MediaCard,
  },
})
export default class extends Vue {
  @Prop({ type: Boolean, default: true }) prizes!: boolean;
  @State disableSave!: boolean;
  @Action save!: Save;

  cloneText(): MediaBox.RotationElem {
    return clone('text', undefined, 'Your text here');
  }
}
</script>
