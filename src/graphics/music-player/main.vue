<template>
  <div>
    <audio
      ref="MusicPlayer"
      controls
      volume="1"
    >
      <source
        ref="MusicSource"
        :src="musicSrc"
        type="audio/mpeg"
      >
    </audio>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { Asset } from 'types';
import { UpdatePosition, UpdateFile, UpdatePlayingState, StateTypes, UpdatePausedState } from './store'; // eslint-disable-line object-curly-newline, max-len

@Component
export default class extends Vue {
  @State playing!: StateTypes['playing'];
  @State paused!: StateTypes['paused'];
  @State position!: StateTypes['position'];
  @State sum!: StateTypes['sum'];
  @Mutation updatePosition!: UpdatePosition;
  @Mutation updateFile!: UpdateFile;
  @Mutation updatePlayingState!: UpdatePlayingState;
  @Mutation updatePausedState!: UpdatePausedState;
  @State music!: Asset[];
  player!: HTMLAudioElement;
  source!: HTMLSourceElement;
  musicSrc: string | null = null;
  defaultVolume = 0.2;

  pickSong(): Asset | undefined {
    // TODO: add logic so songs are not played too much
    const rand = Math.floor(Math.random() * this.music.length);
    return this.music[rand];
  }

  setup(): void {
    const prevSong = this.music.find((s) => s.sum === this.sum);
    const song = prevSong || this.pickSong();
    this.musicSrc = song.url;
    this.updateFile(song.sum);
    this.player.load();
    if (this.position && prevSong) {
      this.player.currentTime = this.position;
    }
    if (!this.paused) {
      this.player.play().catch(() => {
        // Did not play before new load
      });
    }
  }

  destroy(): void {
    this.musicSrc = null;
    this.player.load();
  }

  onEnd(): void {
    this.updatePosition();
    this.updateFile();
    this.updatePlayingState(false);
    if (this.music.length) {
      this.setup();
    } else {
      this.destroy();
    }
  }

  @Watch('music')
  onMusic(newVal: Asset[], oldVal: Asset[]): void {
    if (oldVal.length === 0 && newVal.length > 0) {
      // Don't re-setup if a song is already playing.
      if (!this.playing) {
        this.setup();
      }
    } else if (oldVal.length > 0 && newVal.length === 0) {
      // Don't destroy if a song is already playing.
      if (!this.playing) {
        this.onEnd();
      }
    } else if (!this.music.find((s) => s.sum === this.sum)) {
      this.onEnd();
    }
  }

  mounted(): void {
    this.player = this.$refs.MusicPlayer as HTMLAudioElement;
    this.source = this.$refs.MusicSource as HTMLSourceElement;
    this.player.volume = this.defaultVolume;
    if (this.music.length) {
      this.setup();
    }

    // Listener to update the time in the replicant.
    this.player.addEventListener('timeupdate', () => {
      this.updatePosition(this.player.currentTime);
    });

    this.player.addEventListener('play', () => {
      this.updatePlayingState(true);
      this.updatePausedState(false);
    });

    // Triggered on pausing, seeking, and when ending (just before "ended").
    this.player.addEventListener('pause', () => {
      this.updatePlayingState(false);
      this.updatePausedState(true);
    });

    this.player.addEventListener('ended', () => {
      this.updatePausedState(false);
      this.onEnd();
    });

    this.source.addEventListener('error', () => {
      this.onEnd();
    });

    window.addEventListener('beforeunload', () => {
      this.updatePlayingState(false);
    });
  }
}
</script>
