<template>
  <div :style="{ display: 'flex', width: '100%', height: '100vh' }">
    <div :style="{ flex: '1' }">
      <div class="Flex StreamEmbed">
        <template v-if="playerStreams.length">
          <div
            v-for="stream in playerStreams"
            :key="stream"
            class="Flex"
            :style="{
              width: '100%',
              height: '100%',
            }"
          >
            <iframe
              v-if="stream"
              :src="`https://player.twitch.tv/?channel=${stream}`
                + `&parent=${domain}&autoplay&muted`"
              allowfullscreen="true"
              :style="{
                width: '100%',
                height: '100%',
                border: 0,
              }"
            />
            <template v-else>
              Player Stream Unavailable
            </template>
          </div>
        </template>
        <template v-else>
          No Player Streams Set
        </template>
      </div>
      <div class="Flex StreamEmbed">
        <iframe
          :src="`https://player.twitch.tv/?channel=esamarathon`
            + `&parent=${domain}&autoplay&muted`"
          allowfullscreen="true"
          :style="{
            width: '100%',
            height: '100%',
            border: 0,
          }"
        />
      </div>
    </div>
    <div :style="{ width: '340px' }">
      <iframe
        :src="`https://www.twitch.tv/embed/esamarathon/chat?darkpopout&parent=${domain}`"
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
import { RestreamData } from '@esa-layouts/types/schemas';
import { Configschema } from '@esa-layouts/types/schemas/configschema';

@Component
export default class extends Vue {
  config = (nodecg.bundleConfig as Configschema).restream;
  @State restreamData!: RestreamData;
  domain = window.location.hostname;

  get playerStreams(): (string | undefined)[] {
    return this.restreamData.map((d) => d.channel);
  }
}
</script>

<style>
  body {
    background-color: #19171c;
    color: white;
    font-size: 30px;
    text-align: center;
  }

  iframe {
    display: block;
  }

  .StreamEmbed {
    height: 50vh;
  }
</style>
