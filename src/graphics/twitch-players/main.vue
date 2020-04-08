<template>
  <div :style="{ display: 'flex', width: '100%', height: '100vh' }">
    <div :style="{ flex: '1' }">
      <div class="StreamEmbed">
        <template v-if="config.enable && playerStream">
          <iframe
            :src="`https://player.twitch.tv/?channel=${playerStream}&autoplay=true&muted=true`"
            frameborder="0"
            scrolling="no"
            allowfullscreen="true"
            :style="{ width: '100%', height: '100%' }"
          />
        </template>
        <template v-else>
          Player Stream Unavailable
        </template>
      </div>
      <div class="StreamEmbed">
        <iframe
          src="https://player.twitch.tv/?channel=esamarathon&autoplay=true&muted=true"
          frameborder="0"
          scrolling="no"
          allowfullscreen="true"
          :style="{ width: '100%', height: '100%' }"
        />
      </div>
    </div>
    <div :style="{ width: '340px' }">
      <iframe
        src="https://www.twitch.tv/embed/esamarathon/chat?darkpopout"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true"
        :style="{ width: '100%', height: '100%' }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RestreamViewerTool } from 'schemas';
import { Configschema } from 'configschema';

@Component
export default class extends Vue {
  config = (nodecg.bundleConfig as Configschema).restream;
  @State restreamViewerTool!: RestreamViewerTool;

  get playerStream(): string | undefined {
    return this.restreamViewerTool.channel;
  }
}
</script>

<style>
  body {
    color: var(--font-colour-inverted);
    background-color: #19171c;
    font-size: 5vw;
  }

  iframe {
    display: block;
  }

  .StreamEmbed {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
</style>
