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
import { State } from 'vuex-class';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
import { RestreamData } from '@esa-layouts/types/schemas';
import RestreamComponent from '@esamarathon/esa-layouts-shared/restream/dashboard';

@Component({
  components: {
    RestreamComponent,
  },
})
export default class extends Vue {
  @State restreamData!: RestreamData;
  config = (nodecg.bundleConfig as Configschema).restream;
}
</script>
