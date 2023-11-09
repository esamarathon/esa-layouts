<template>
  <transition-group tag="main" :style="mainStyle">
    <div class="contestant"
         v-for="(contestant, i) in contestantsSorted"
         :key="contestant.uuid"
    >
      <div class="frame-scaler"
           :class="{
             'large': contestant.visibleScore === maxScore && maxCount > 2,
             'larger': contestant.visibleScore === maxScore && maxCount <= 2,
           }"
      >
        <div class="frame-container"
             :style="{
               'animationDelay': `${-i * 1.25}s`,
             }"
        >
          <div class="fill"
               style="background-image: var(--frame-inner-picture)"
               :style="{
                 '--frame-inner-picture': getContestantHeadshot(contestant),
               }"
          >
            <div class="shadow"/>
          </div>
          <img src="./assets/frame.png" class="frame">
        </div>
      </div>
      <div class="score-container">
        <img src="./assets/seal.png" class="seal">
        <h1 class="score">{{ contestant.visibleScore }}</h1>
      </div>
    </div>
  </transition-group>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { TaskmasterContestant, TaskMasterContestantList } from '@esa-layouts/types/schemas';
import NodeCGTypes from '@nodecg/types';

@Component
export default class extends Vue {
  @replicantNS.State(
    (s) => s.reps.taskmasterContestantList,
  ) readonly contestants!: TaskMasterContestantList;
  @replicantNS.State(
    (s) => s.reps.assetsTaskmasterParticipantHeadshots,
  ) readonly headshots!: NodeCGTypes.AssetFile[];

  maxScore = -1;
  maxCount = 1;

  contestantsSorted: TaskMasterContestantList = [];
  locked = false;
  mainStyle = {
    transform: '',
    left: '',
  };

  mounted(): void {
    this.sortContestants();

    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  sortContestants(): void {
    // copy first because sort mutates
    const tmpArray: TaskMasterContestantList = JSON.parse(JSON.stringify(this.contestants));

    tmpArray.sort((a, b) => {
      if (a.currentScore < b.currentScore) {
        return -1;
      }
      if (a.currentScore > b.currentScore) {
        return 1;
      }
      return 0;
    });

    this.maxScore = tmpArray[tmpArray.length - 1].currentScore;
    this.maxCount = 1;

    // eslint-disable-next-line no-plusplus
    for (let i = tmpArray.length - 1; i > 0; --i) {
      const con = tmpArray[i - 1];

      if (con.currentScore === this.maxScore) {
        // eslint-disable-next-line no-plusplus
        ++this.maxCount;
      }
    }

    this.contestantsSorted = tmpArray;
  }

  resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const wm = 1400 * ((this.contestantsSorted.length + (this.locked ? 0 : 0.25)) / 5);

    const m = Math.min(w / wm, h / 1080);

    this.mainStyle.transform = `scale(${m})`;

    this.mainStyle.left = `${(w - wm * m) / 2}px`;
  }

  getContestantHeadshot(contestant: TaskmasterContestant): string | undefined {
    const asset = this.headshots.find(
      (hs) => hs.name.toLowerCase().startsWith(contestant.name.toLowerCase()),
    );

    if (asset) {
      return `url(${asset.url})`;
    }

    return undefined;
  }

  ease(t: number, a: number, b: number) {
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    return (b - a) * eased + a;
  }

  play(): void {
    if (!this.locked) {
      this.locked = true;
      document.body.classList.add('locked');
      this.resize();
    }

    const tmpScores: { [key: string]: number } = {};

    for (const contestant of this.contestantsSorted) {
      tmpScores[contestant.uuid] = contestant.visibleScore;
    }

    let start = 0;
    const loop = (dt: number) => {
      if (start === 0) {
        start = dt;
      }

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.contestantsSorted.length; ++i) {
        const con = this.contestantsSorted[i];
        const transitionScore = tmpScores[con.uuid];

        const startRemainder = transitionScore - Math.floor(transitionScore);
        const endRemainder = con.currentScore - Math.floor(con.currentScore);

        let score = Math.round(this.ease(
          Math.min((dt - start) / 2000, 1),
          Math.floor(transitionScore),
          Math.floor(con.currentScore),
        ));

        if (dt - start < 1000) {
          score += startRemainder;
        } else {
          score += endRemainder;
        }

        con.visibleScore = score;
      }

      if (dt - start < 2000) {
        // window.requestAnimationFrame(loop);
        this.$nextTick(() => {
          window.requestAnimationFrame(loop);
        });
      }
    };

    this.sortContestants();
    window.requestAnimationFrame(loop);
  }

  scoreIsSame(o1: TaskmasterContestant): boolean {
    const o2 = this.contestantsSorted.find((c) => c.uuid === o1.uuid);

    if (!o2) {
      return false;
    }

    return o2.visibleScore === o1.visibleScore;
  }

  @Watch('contestants', { deep: true })
  contestantsUpdated() {
    if (this.contestantsSorted.length === this.contestants.length) {
      if (this.contestants.find((c) => !this.scoreIsSame(c))) {
        this.play();
      }
      return;
    }

    this.sortContestants();
    this.resize();
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: 'veteran_typewriterregular';
  src: url('./assets/veteran_typewriter-webfont.eot');
  src: url('./assets/veteran_typewriter-webfont.eot?#iefix') format('embedded-opentype'),
  url('./assets/veteran_typewriter-webfont.woff2') format('woff2'),
  url('./assets/veteran_typewriter-webfont.woff') format('woff'),
  url('./assets/veteran_typewriter-webfont.ttf') format('truetype'),
  url('./assets/veteran_typewriter-webfont.svg#veteran_typewriterregular') format('svg');
  font-weight: normal;
  font-style: normal;

}

* {
  --frame-inner-picture: url('./assets/blank.jpg');
}

html {
  background-image: url("./assets/background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  font-size: 62.5%;
}

html, body {
  width: 100%;
  height: 100%;
  position: fixed;
}

body {
  display: block;
  padding: 0;
  margin: 0;
  font-size: 20px;
  font-size: 2.0rem;
  font-family: sans-serif;
  overflow: hidden;
  position: relative;
}

main {
  width: 1400px;
  height: 413px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  transform-origin: left;
  display: block;
  overflow: visible;
}

.contestant {
  width: 205px;
  margin: 0 auto;
  margin-right: 69px;
  position: relative;
  display: inline-block;
  transform-origin: center;
  transform: translateX(var(--position-in-frame));
  transition: transform 2s;
}

.contestant img {
  width: 100%;
}

.score-container, .frame-container {
  position: relative;
}

.frame-scaler {
  transition: transform 2s;
  transform-origin: bottom;
}

.larger {
  -ms-transform: scale(1.2);
  transform: scale(1.2);
}

.large {
  -ms-transform: scale(1.1);
  transform: scale(1.1);
}

.frame-container {
  filter: drop-shadow(15px 15px 3px rgba(0, 0, 0, 0.4));
  margin-bottom: 25px;
  height: 250px;
  transform-origin: center;
  -webkit-animation: rotate 3s ease-in-out alternate infinite;
  animation: rotate 3s ease-in-out alternate infinite;
}

.frame {
  transform: translateZ(0);
}

@keyframes rotate {
  0% {
    transform: rotate(-4deg);
  }

  100% {
    transform: rotate(4deg);
  }
}

.frame-container img {
  position: absolute;
}

.fill {
  top: 33px;
  right: 33px;
  bottom: 33px;
  left: 33px;

  position: absolute;

  background-color: white;
  background-position: center;
  background-size: cover;

  overflow: hidden;
}

.shadow {
  width: 100%;
  height: 100%;
  position: absolute;

  top: 0;
  left: 0;

  box-shadow: inset -5px 5px 7px rgba(0, 0, 0, 0.5);
}

.score-container {
}

.score {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  box-sizing: border-box;

  line-height: 180px;

  text-align: center;
  vertical-align: middle;

  margin: 0;
  padding: 0;
  margin-left: 8px;

  color: white;
  font-family: "veteran_typewriterregular", sans-serif;

  font-size: 84px;

  font-weight: normal;
  font-style: normal;

  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  background-size: cover;
  background-position: center;

  display: none;
}

#file-input {
  display: none;
}
</style>
