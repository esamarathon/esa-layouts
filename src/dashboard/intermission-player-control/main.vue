<template>
  <v-app>
    <available-videos />
    <playlist :style="{ 'margin-top': '20px' }" />

    <!-- Save/Refresh Buttons -->
    <div
      class="d-flex"
      :style="{ 'margin-top': '20px' }"
    >
      <v-btn
        class="flex-grow-1"
        :loading="disableSave"
        :disabled="disableSave"
        @click="save()"
      >
        Save
      </v-btn>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            :style="{ 'margin-left': '5px' }"
            @click="playlistRefresh()"
            v-on="on"
          >
            <v-icon>
              mdi-refresh
            </v-icon>
          </v-btn>
        </template>
        <span>Revert Local Changes</span>
      </v-tooltip>
    </div>

    <current-video-info :style="{ 'margin-top': '10px' }" />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Action, Mutation } from 'vuex-class';
import AvailableVideos from './components/AvailableVideos.vue';
import Playlist from './components/Playlist.vue';
import CurrentVideoInfo from './components/CurrentVideoInfo.vue';
import { Save, PlaylistRefresh } from './store';

@Component({
  components: {
    AvailableVideos,
    Playlist,
    CurrentVideoInfo,
  },
})
export default class extends Vue {
  @State disableSave!: boolean;
  @Mutation playlistRefresh!: PlaylistRefresh;
  @Action save!: Save;
}
</script>
