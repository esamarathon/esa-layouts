<template>
  <v-app
    v-if="!config.useTestData"
    :style="{ 'font-style': 'italic' }"
  >
    Not using test data.
  </v-app>
  <v-app
    v-else-if="!config.rabbitmq.enable"
    :style="{ 'font-style': 'italic' }"
  >
    RabbitMQ not enabled.
  </v-app>
  <v-app v-else>
    <v-btn @click="donation">
      Donation
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Configschema } from 'configschema';

@Component
export default class extends Vue {
  config = nodecg.bundleConfig as Configschema;

  donation(): void {
    nodecg.sendMessage('testRabbitMQ', 'donationFullyProcessed');
  }
}
</script>
