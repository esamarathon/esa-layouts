<template>
  <v-app
    v-if="!useTestData"
    :style="{ 'font-style': 'italic' }"
  >
    Not using test data.
  </v-app>
  <v-app
    v-else-if="!enabled"
    :style="{ 'font-style': 'italic' }"
  >
    RabbitMQ not enabled.
  </v-app>
  <v-app v-else>
    <v-btn @click="donation">
      Donation
    </v-btn>
    <v-btn @click="subscription">
      Subscription
    </v-btn>
    <v-btn @click="cheer">
      Cheer
    </v-btn>
    <v-btn @click="tweet">
      Tweet
    </v-btn>
    <v-btn @click="crowdControl">
      Crowd Control
    </v-btn>
    <div class="d-flex align-center">
      <span title="ExampleUser1, he/him, exampleuser1, DE">Scan Tag 1:</span>
      <v-btn @click="scanTag(1, '1')">B.1</v-btn>
      <v-btn @click="scanTag(1, '2')">B.2</v-btn>
      <v-btn @click="scanTag(1, '3')">B.3</v-btn>
    </div>
    <div class="d-flex align-center">
      <span title="ExampleUser2, she/her, exampleuser2, SE">Scan Tag 2:</span>
      <v-btn @click="scanTag(2, '1')">B.1</v-btn>
      <v-btn @click="scanTag(2, '2')">B.2</v-btn>
      <v-btn @click="scanTag(2, '3')">B.3</v-btn>
    </div>
    <div class="d-flex align-center">
      <span title="ExampleUser3, they/them, exampleuser3, FI">Scan Tag 3:</span>
      <v-btn @click="scanTag(3, '1')">B.1</v-btn>
      <v-btn @click="scanTag(3, '2')">B.2</v-btn>
      <v-btn @click="scanTag(3, '3')">B.3</v-btn>
    </div>
    <div class="d-flex align-center">
      <span title="ExampleUser, no pronouns, no Twitch, no country">Scan Tag 4:</span>
      <v-btn @click="scanTag(4, '1')">B.1</v-btn>
      <v-btn @click="scanTag(4, '2')">B.2</v-btn>
      <v-btn @click="scanTag(4, '3')">B.3</v-btn>
    </div>
    <div class="d-flex align-center">
      Press Button:
      <v-btn @click="pressBtn(1)">B.1</v-btn>
      <v-btn @click="pressBtn(2)">B.2</v-btn>
      <v-btn @click="pressBtn(3)">B.3</v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop(Boolean) enabled!: boolean;
  @Prop(Boolean) useTestData!: boolean;

  donation(): void {
    nodecg.sendMessage('testRabbitMQ', { msgType: 'donationFullyProcessed' });
  }
  subscription(): void {
    nodecg.sendMessage('testRabbitMQ', { msgType: 'newScreenedSub' });
  }
  cheer(): void {
    nodecg.sendMessage('testRabbitMQ', { msgType: 'newScreenedCheer' });
  }
  tweet(): void {
    nodecg.sendMessage('testRabbitMQ', { msgType: 'newScreenedTweet' });
  }
  crowdControl(): void {
    nodecg.sendMessage('testRabbitMQ', { msgType: 'newScreenedCrowdControl' });
  }
  scanTag(tag: number, id: string): void {
    nodecg.sendMessage('testRabbitMQ', { msgType: 'bigbuttonTagScanned', data: { tag, id } });
  }
  pressBtn(id: number): void {
    nodecg.sendMessage('testRabbitMQ', { msgType: 'bigbuttonPressed', data: { id } });
  }
}
</script>
