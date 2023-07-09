<template>
  <v-tooltip
    v-if="isApplicable === true"
    right
  >
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">
        mdi-check
      </v-icon>
    </template>
    <span>Applicable</span>
  </v-tooltip>
  <v-tooltip
    v-else-if="isApplicable === false"
    right
  >
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">
        mdi-close
      </v-icon>
    </template>
    <span>Not Currently Applicable</span>
  </v-tooltip>
  <v-tooltip
    v-else
    right
  >
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">
        mdi-help
      </v-icon>
    </template>
    <span>Unknown</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ type: Boolean, required: false }) isApplicable!: boolean | undefined;
}
</script>
