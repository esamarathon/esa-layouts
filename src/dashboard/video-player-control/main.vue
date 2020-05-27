<template>
  <v-app>
    <available-videos />
    <playlist :style="{ 'margin-top': '20px' }" />

    <!-- Save Button -->
    <v-btn
      :loading="disableSave"
      :disabled="disableSave"
      :style="{ 'margin-top': '20px' }"
      @click="save()"
    >
      Save
    </v-btn>
    <v-btn @click="refresh()">
      Refresh Local Playlist
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Action, Mutation } from 'vuex-class';
import AvailableVideos from './components/AvailableVideos.vue';
import Playlist from './components/Playlist.vue';
import { Save, Refresh } from './store';

@Component({
  components: {
    AvailableVideos,
    Playlist,
  },
})
export default class extends Vue {
  @State disableSave!: boolean;
  @Mutation refresh!: Refresh;
  @Action save!: Save;
}
</script>
