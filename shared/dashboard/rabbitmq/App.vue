<template>
  <v-app
    v-if="!useTestData"
    :style="{ 'font-style': 'italic' }"
  >
    Not using test data.
  </v-app>
  <v-app
    v-else-if="!enable"
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
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop(Boolean) enable!: boolean;
  @Prop(Boolean) useTestData!: boolean;

  donation(): void {
    nodecg.sendMessage('testRabbitMQ', 'donationFullyProcessed');
  }
  subscription(): void {
    nodecg.sendMessage('testRabbitMQ', 'newScreenedSub');
  }
  cheer(): void {
    nodecg.sendMessage('testRabbitMQ', 'newScreenedCheer');
  }
}
</script>
