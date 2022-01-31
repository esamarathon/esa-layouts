<template>
  <v-app>
    <!-- Edit Dialog -->
    <edit-dialog />

    <!-- New Components -->
    <span class="text-h6">New Components</span>
    <draggable
      class="d-flex flex-wrap"
      :list="availableTypes"
      :group="{ name: 'ticker', pull: 'clone', put: false }"
      :clone="clone"
      :sort="false"
      :style="{ gap: '0px 10px' }"
    >
      <v-card
        v-for="type in availableTypes"
        class="pa-2 mt-2"
        :key="type.key"
      >
        {{ type.name }}
      </v-card>
    </draggable>

    <!-- Rotation -->
    <span class="text-h6 mt-4">Rotation</span>
    <v-card v-if="!localRotation.length" class="pa-2 mt-2 font-italic">
      Drag elements from above to here to add.
    </v-card>
    <draggable
      v-model="localRotation"
      group="ticker"
      ghost-class="Ghost"
      tag="transition-group"
      :animation="200"
      :componentData="{
        props: {
          tag: 'div',
        },
      }"
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <component
        v-for="item in localRotation"
        class="mt-2"
        :key="item.id"
        :is="item.type"
        :id="item.id"
        v-bind="item.props"
      />
    </draggable>

    <!-- Save/Revert -->
    <div class="d-flex mt-2">
      <v-btn class="flex-grow-1 mr-2" :disabled="!isEdited" @click="save">
        Save
      </v-btn>
      <v-btn :disabled="!isEdited" @click="setLocalRotationFromGlobal()">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <!-- Cycle Information -->
    <div v-if="currentItem.type" class="text-center mt-4">
      <span class="font-weight-bold">Current:</span>
      {{ currentItem.name }}
      <br><span class="font-weight-bold">{{ currentItem.secondsStr }}:</span>
      {{ currentItem.seconds }} -
      <span class="font-weight-bold">Position:</span>
      {{ (currentItem.index + 1) || '?' }}/{{ omnibar.rotation.length }}
      <template v-if="currentItem.type === 'GenericMsg'">
        <br><span class="font-weight-bold">Message:</span>
        {{ currentItem.msg }}
      </template>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { Omnibar } from '@esa-layouts/types/schemas';
import clone from 'clone';
import Draggable from 'vuedraggable';
import { v4 as uuid } from 'uuid';
import EditDialog from './components/EditDialog.vue';
import GenericMsg from './components/GenericMsg.vue';
import Bid from './components/Bid.vue';
import Milestone from './components/Milestone.vue';
import Prize from './components/Prize.vue';
import UpcomingRun from './components/UpcomingRun.vue';
import { storeModule } from './store';

@Component({
  components: {
    EditDialog,
    Draggable,
    GenericMsg,
    Bid,
    Milestone,
    Prize,
    UpcomingRun,
  },
})
export default class IntermissionControl extends Vue {
  @replicantNS.State((s) => s.reps.omnibar) readonly omnibar!: Omnibar;
  availableTypes: { key: Omnibar['rotation'][0]['type'], name: string }[] = [
    {
      key: 'GenericMsg',
      name: 'Generic Message',
    },
    {
      key: 'Bid',
      name: 'Random Bid (favours sooner)',
    },
    {
      key: 'Milestone',
      name: 'Random Milestone',
    },
    {
      key: 'Prize',
      name: 'Random Prize',
    },
    {
      key: 'UpcomingRun',
      name: 'Upcoming Run (1 of next 4)',
    },
  ];

  get localRotation(): Omnibar['rotation'] { return storeModule.localRotation; }
  set localRotation(val: Omnibar['rotation']) {
    storeModule.setLocalRotation({ val, manual: true });
  }

  get isEdited(): boolean {
    return storeModule.localEdits;
  }

  get currentItem(): {
    index: number,
    type?: string,
    name?: string,
    seconds: number,
    secondsStr: string,
    msg: string,
  } {
    return {
      index: this.omnibar.rotation.findIndex((r) => r.id === this.omnibar.current?.id),
      type: this.omnibar.current?.type,
      name: this.availableTypes
        .find((t) => t.key === this.omnibar.current?.type)?.name || this.omnibar.current?.type,
      seconds: this.omnibar.current?.props?.seconds || 0,
      secondsStr: ['Bid', 'MiniCredits'].includes(this.omnibar.current?.type || '')
        ? 'Minimum Length (seconds)'
        : 'Length (seconds)',
      msg: (this.omnibar.current?.props?.msg as string | undefined) || '',
    };
  }

  setLocalRotationFromGlobal(val?: Omnibar['rotation']): void {
    storeModule.setLocalRotation({ val: clone(val || this.omnibar.rotation) });
  }

  @Watch('omnibar.rotation')
  onGlobalRotationChange(val: Omnibar['rotation']): void {
    if (!storeModule.localEdits) this.setLocalRotationFromGlobal(val);
  }

  created(): void {
    this.setLocalRotationFromGlobal();
  }

  clone(original: { key: Omnibar['rotation'][0]['type'], name: string }): Omnibar['rotation'][0] {
    return {
      type: original.key,
      id: uuid(),
      props: {
        seconds: 25,
        msg: original.key === 'GenericMsg'
          ? 'Message?'
          : undefined,
      },
    };
  }

  save(): void {
    storeModule.setGlobalRotation(this.localRotation);
  }
}
</script>

<style scoped>
  .Ghost {
    opacity: 0.5;
  }
</style>
