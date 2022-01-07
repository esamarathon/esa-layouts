<template>
  <v-app>
    <div
      v-if="!config.enable"
      :style="{
        'font-style': 'italic',
      }"
    >
      This feature is not enabled.
    </div>
    <template v-else>
      <restream-component
        :restream-data="restreamData"
        name="Stream 1"
        :index="0"
      />
      <restream-component
        v-if="Array.isArray(config.instances)"
        class="pt-3"
        :restream-data="restreamData"
        name="Stream 2"
        :index="1"
      />
    </template>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
import { RestreamData } from '@esa-layouts/types/schemas';
import RestreamComponent from '@shared/dashboard/restream';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';

@Component({
  components: {
    RestreamComponent,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.restreamData) readonly restreamData!: RestreamData;
  config = (nodecg.bundleConfig as Configschema).restream;
}
</script>
