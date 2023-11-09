<template>
  <v-app>
    <v-row>
      <v-col>
        <p>Contestant name is used for image lookup in the assets ({name}.ext)</p>
        <p>Temp score / visible score</p>
      </v-col>
      <v-col>
        <p>Add points or remove contestant</p>
      </v-col>
    </v-row>
    <div v-for="contestant in contestants" :key="contestant.uuid">
      <div>
        <v-row>
          <v-col>
            <p>{{ contestant.name }} -
                ({{ contestant.currentScore }} / {{ contestant.visibleScore }})
            </p>
          </v-col>
          <v-col>
            <v-btn v-for="i in [1,2,3,4,5]" :key="`${contestant.uuid}-${i}`"
                   @click="addContestantPoints(contestant.uuid, i)"
                   small>
              {{ i }}
            </v-btn>
            <v-btn color="red" @click="removeContestant(contestant.uuid)" small icon>
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-row>
      <v-col>
        <v-btn @click="addContestant">Add contestant</v-btn>
      </v-col>
      <v-col>
        <v-btn color="warning" @click="sendToGraphic" class="ml-2">Send to graphic</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="red" @click="resetAllScores">Reset ALL scores</v-btn>
      </v-col>
      <v-col>
        <v-btn color="red" @click="resetTempScores">Reset temp scores</v-btn>
      </v-col>
    </v-row>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { TaskMasterContestantList } from '@esa-layouts/types/schemas';
import { storeModule } from './store';

@Component
export default class extends Vue {
  @replicantNS.State(
    (s) => s.reps.taskmasterContestantList,
  ) readonly contestants!: TaskMasterContestantList;

  removeContestant = storeModule.removeParticipant;
  resetTempScores = storeModule.resetTempScores;
  resetAllScores = storeModule.resetAllScores;
  sendToGraphic = storeModule.sendUpdate;

  addContestantPoints(id: string, points: number): void {
    storeModule.addPoints({ id, points });
  }

  addContestant(): void {
    // eslint-disable-next-line no-alert
    const newName = prompt('Enter contestant name (used for image lookup)');

    if (!newName) {
      return;
    }

    storeModule.addParticipant(newName);
  }
}
</script>
