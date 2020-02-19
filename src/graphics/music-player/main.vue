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
import { gsap } from 'gsap';
import { Asset } from 'types';
import jsmediatags from 'jsmediatags';
import { UpdatePosition, UpdateFile, UpdatePlayingState, StateTypes, UpdatePausedState, UpdateMetadata, UpdateHistory } from './store'; // eslint-disable-line object-curly-newline, max-len

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
  @Mutation updateMetadata!: UpdateMetadata;
  @Mutation updateHistory!: UpdateHistory;
  @State music!: Asset[];
  player!: HTMLAudioElement;
  source!: HTMLSourceElement;
  musicSrc: string | null = null;
  defaultVolume = 0.2; // Will be replaced with an actual setting later.
  currentVolume = 0;
  onScene = false;

  pickSong(): Asset | undefined {
    // TODO: add logic so songs are not played too much
    const rand = Math.floor(Math.random() * this.music.length);
    return this.music[rand];
  }

  setup(): void {
    const prevSong = this.music.find((s) => s.sum === this.sum);
    const song = prevSong || this.pickSong();
    if (song) {
      this.musicSrc = song.url;
      this.updateFile(song.sum);
      this.player.load();
      if (this.position && prevSong) {
        this.player.currentTime = this.position;
      } else {
        this.updateHistory(song.sum);
      }
      if (!this.paused) {
        this.player.play().catch(() => {
          // Did not play before new load
        });
      }
      // Get/store metadata.
      jsmediatags.read(`${window.location.origin}${song.url}`, {
        onSuccess: (tag: { tags: { title: string; artist: string }}) => {
          this.updateMetadata({ title: tag.tags.title, artist: tag.tags.artist });
        },
        onError: () => {
          // Did not load metadata
          this.updateMetadata();
        },
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
    this.updateMetadata();
    if (this.music.length) {
      this.setup();
    } else {
      this.destroy();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @Watch('onScene')
  onSceneChange(val: boolean) {
    if (val) {
      gsap.to(this, { currentVolume: this.defaultVolume, duration: 2 });
    } else {
      gsap.to(this, { currentVolume: 0, duration: 2 });
    }
  }

  @Watch('currentVolume')
  onVolumeChange(val: number): void {
    this.player.volume = val;
    if (val > 0 && this.paused) {
      this.player.play().catch(() => {
        // For some reason, playing did not work
      });
    } else if (val === 0 && !this.paused) {
      this.player.pause();
    }
  }

  @Watch('music')
  onMusic(newVal: Asset[], oldVal: Asset[]): void {
    if (oldVal.length === 0 && newVal.length > 0) {
      // Don't re-setup if a song is already playing.
      if (!this.playing) {
        this.updatePausedState(!this.onScene);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obs = (window as any).obsstudio;
    if (obs) {
      obs.getCurrentScene((scene: { name: string }) => {
        this.onScene = scene.name.endsWith('[M]');
        this.updatePausedState(!this.onScene);
        this.currentVolume = this.onScene ? this.defaultVolume : 0;
        if (this.music.length) {
          this.setup();
        }
      });
    }

    window.addEventListener('obsSceneChanged', (evt) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.onScene = (evt as any).detail.name.endsWith('[M]');
    });
  }
}
</script>
