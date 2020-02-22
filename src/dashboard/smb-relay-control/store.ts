import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser';
import { SmbRelay } from 'schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/schemas';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  smbRelay: ReplicantBrowser<SmbRelay>;
  runDataActiveRun: ReplicantBrowser<RunDataActiveRun>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  smbRelay: nodecg.Replicant('smbRelay'),
  runDataActiveRun: nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
};

// Types for mutations below
export type UpdatePlayer = ({ i, name }: { i: number; name: string }) => void;
export type PreviousPlayer = () => void;
export type NextPlayer = () => void;

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    /* Mutations to replicants start */
    updatePlayer(state, { i, name }): void {
      if (typeof reps.smbRelay.value !== 'undefined') {
        reps.smbRelay.value.players[i] = name;
      }
    },
    previousPlayer(): void {
      if (typeof reps.smbRelay.value !== 'undefined'
        && typeof reps.smbRelay.value.current === 'number') {
        reps.smbRelay.value.current -= 1;
      }
    },
    nextPlayer(): void {
      if (typeof reps.smbRelay.value !== 'undefined'
        && typeof reps.smbRelay.value.current === 'number') {
        reps.smbRelay.value.current += 1;
      }
    },
    /* Mutations to replicants end */
  },
});

Object.keys(reps).forEach((key) => {
  reps[key].on('change', (val) => {
    store.commit('setState', { name: key, val: clone(val) });
  });
});

export default async function (): Promise<Store<{}>> {
  return NodeCG.waitForReplicants(
    ...Object.keys(reps).map((key) => reps[key]),
  ).then(() => store);
}
