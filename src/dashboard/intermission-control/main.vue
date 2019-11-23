<template>
  <v-app>
    <v-btn
      @click="send"
    >
      Force Refresh Intermission
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
@Component
export default class IntermissionControl extends Vue {
  @Emit()
  // eslint-disable-next-line class-methods-use-this
  send(): void {
    nodecg.sendMessage('forceRefreshIntermission');
  }
}
</script>
