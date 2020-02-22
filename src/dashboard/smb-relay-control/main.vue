<template>
  <v-app>
    <div v-if="runDataActiveRun && runDataActiveRun.customData.id === '260e49dc5db49745a4640d81'">
      <div class="d-flex justify-center">
        <template v-if="currentPlayerIndex >= 0">
          Current: ({{ currentPlayerIndex + 1 }}) {{ currentPlayer }}
        </template>
        <template v-else>
          Current: Not Set
        </template>
      </div>
      <div class="d-flex justify-center">
        <v-btn
          :disabled="currentPlayerIndex <= 0"
          @click="previousPlayer()"
        >
          Previous
        </v-btn>
        <v-btn
          class="ml-1"
          :disabled="currentPlayerIndex >= players.length - 1"
          @click="nextPlayer()"
        >
          Next
        </v-btn>
      </div>
    </div>
    <div
      v-else
      class="d-flex justify-center"
      :style="{ 'font-style': 'italic' }"
    >
      Not currently on the correct run.
    </div>
    <div
      class="d-flex justify-center mt-1"
      :style="{ 'font-style': 'italic' }"
    >
      Double click names to edit.
    </div>
    <ol
      :style="{
        'max-height': '250px',
        'overflow-y': 'auto',
        'overflow-x': 'hidden',
        'padding-left': '40px',
      }"
    >
      <li
        v-for="(player, i) in players"
        :key="i"
      >
        <input
          v-if="edit === i"
          v-model="input"
          @blur="update"
          @keyup.enter="update"
        >
        <div
          v-else
          @click="edit = i; input = player"
        >
          {{ player }}
        </div>
      </li>
    </ol>
    <v-btn @click="defaultPlayers">
      Default Players
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { SmbRelay } from 'schemas';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/schemas';
import { UpdatePlayer, PreviousPlayer, NextPlayer } from './store';

@Component
export default class extends Vue {
  @State smbRelay!: SmbRelay;
  @State runDataActiveRun!: RunDataActiveRun;
  @Mutation updatePlayer!: UpdatePlayer;
  @Mutation previousPlayer!: PreviousPlayer;
  @Mutation nextPlayer!: NextPlayer;
  edit = -1;
  input = '';

  get currentPlayer(): string | undefined {
    return this.smbRelay.players[this.currentPlayerIndex];
  }

  get currentPlayerIndex(): number {
    return (this.smbRelay.current >= 0) ? this.smbRelay.current : -1;
  }

  get players(): SmbRelay['players'] {
    return this.smbRelay.players;
  }

  update(): void {
    if (this.input) {
      this.updatePlayer({ i: this.edit, name: this.input });
      this.edit = -1;
      this.input = '';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  defaultPlayers(): void {
    nodecg.sendMessage('smbRelayDefaultPlayers');
  }
}
</script>
