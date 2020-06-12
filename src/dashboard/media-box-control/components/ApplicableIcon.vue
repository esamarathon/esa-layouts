<template>
  <v-tooltip
    v-if="isApplicable"
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
    v-else
    right
  >
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">
        mdi-close
      </v-icon>
    </template>
    <span>Not Currently Applicable</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop(Boolean) isApplicable!: boolean;
}
</script>
