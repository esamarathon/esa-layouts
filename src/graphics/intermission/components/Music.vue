<template>
  <div class="Music Flex">
    <div class="MCat">
      <img src="./MCat_Logo.png">
    </div>
    <div class="Name">
      <template v-if="musicPlayer.playing">
        <span v-if="musicPlayer.metadata.title">
          {{ musicPlayer.metadata.title }}
        </span>
        <span v-if="musicPlayer.metadata.artist">
          - {{ musicPlayer.metadata.artist }}
        </span>
      </template>
      <template v-else>
        No Track Playing
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MusicPlayer } from 'schemas';

@Component
export default class extends Vue {
  @State musicPlayer!: MusicPlayer;
}
</script>

<style scoped>
  .Music {
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .MCat {
    box-sizing: border-box;
    background-color: var(--border-colour);
    height: 100%;
    padding: 5px;
  }

  .MCat > img {
    height: 100%;
    object-fit: contain;
  }

  .Name {
    flex: 1;
    padding: 0 15px;
    line-height: 70%;
  }
</style>
