import { replicantModule, ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { v4 as uuid } from 'uuid';
import { TaskMasterContestantList } from '@esa-layouts/types/schemas';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }

  @Mutation
  addParticipant(name: string): void {
    // TODO: store contestants with their id as a key instead?.
    const contestants = replicantModule.repsTyped.taskmasterContestantList;

    contestants.push({
      uuid: uuid(),
      name,
      visibleScore: 0,
      currentScore: 0,
    });

    replicantModule.setReplicant<TaskMasterContestantList>({
      name: 'taskmasterContestantList',
      val: contestants,
    });
  }

  @Mutation
  removeParticipant(id: string): void {
    const contestants = replicantModule.repsTyped.taskmasterContestantList;
    const rightPerson = contestants.findIndex((contestant) => contestant.uuid === id);

    if (rightPerson > -1) {
      contestants.splice(rightPerson, 1);

      replicantModule.setReplicant<TaskMasterContestantList>({
        name: 'taskmasterContestantList',
        val: contestants,
      });
    }
  }

  @Mutation
  addPoints({ id, points }: { id: string, points: number }): void {
    const contestants = replicantModule.repsTyped.taskmasterContestantList;
    const rightPerson = contestants.findIndex((contestant) => contestant.uuid === id);

    if (rightPerson > -1) {
      const person = contestants[rightPerson];

      if (Number.isNaN(person.currentScore)) {
        person.currentScore = 0;
      }

      person.currentScore = (person.currentScore || 0) + points;

      contestants[rightPerson] = person;

      replicantModule.setReplicant<TaskMasterContestantList>({
        name: 'taskmasterContestantList',
        val: contestants,
      });
    }
  }

  @Mutation
  resetTempScores(): void {
    const contestants = replicantModule.repsTyped.taskmasterContestantList;

    contestants.forEach((contestant) => {
      // eslint-disable-next-line no-param-reassign
      contestant.currentScore = contestant.visibleScore;
    });

    replicantModule.setReplicant<TaskMasterContestantList>({
      name: 'taskmasterContestantList',
      val: contestants,
    });
  }

  @Mutation
  resetAllScores(): void {
    replicantModule.setReplicant<TaskMasterContestantList>({
      name: 'taskmasterContestantList',
      val: replicantModule.repsTyped.taskmasterContestantList.map((c) => ({
        ...c,
        visibleScore: 0,
        currentScore: 0,
      })),
    });
  }

  @Mutation
  sendUpdate(): void {
    const contestants = replicantModule.repsTyped.taskmasterContestantList;

    contestants.forEach((contestant) => {
      // eslint-disable-next-line no-param-reassign
      contestant.visibleScore = contestant.currentScore;
    });

    replicantModule.setReplicant<TaskMasterContestantList>({
      name: 'taskmasterContestantList',
      val: contestants,
    });
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
