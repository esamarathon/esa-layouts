<template>
  <v-app>
    <available-images />
    <available-prizes :style="{ 'margin-top': '20px' }" />
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
import { Vue, Component } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { Save } from './store';
import AvailableImages from './components/AvailableImages.vue';
import AvailablePrizes from './components/AvailablePrizes.vue';
import Rotation from './components/Rotation.vue';
import CurrentMediaInfo from './components/CurrentMediaInfo.vue';

@Component({
  components: {
    AvailableImages,
    AvailablePrizes,
    Rotation,
    CurrentMediaInfo,
  },
})
export default class extends Vue {
  @State disableSave!: boolean;
  @Action save!: Save;
}
</script>
