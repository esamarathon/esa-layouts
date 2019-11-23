import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

const replicantList: { name: string; bundle?: string }[] = [
  { name: 'currentVideoSum' },
  { name: 'assets:videos' },
  { name: 'currentLayout' },
  { name: 'layouts' },
  { name: 'currentLayoutOverridden' },
];
const replicants: ReplicantBrowser<unknown>[] = [];

interface StoreTypes {
  currentVideoSum: string | undefined;
  'assets:videos': unknown[];
  currentLayout: string | undefined;
  layouts: unknown[];
  currentLayoutOverridden: boolean;
}

export const store = new Vuex.Store<StoreTypes>({
  mutations: {
    updateReplicant(state, { name, value }): void {
      Vue.set(state, name, value);
    },
    updateCurrentVideoSum(state, sum): void {
      const rep = replicants.find((repObj) => repObj.name === 'currentVideoSum');
      if (rep) {
        rep.value = sum;
      }
    },
    updateCurrentLayout(state, sum): void {
      const rep1 = replicants.find((repObj) => repObj.name === 'currentLayout');
      const rep2 = replicants.find((repObj) => repObj.name === 'currentLayoutOverridden');
      if (rep1 && rep2) {
        rep1.value = sum;
        rep2.value = true;
      }
    },
  },
});

replicantList.forEach((obj) => {
  const replicant = nodecg.Replicant(obj.name, obj.bundle || 'esa-layouts');

  replicant.on('change', (newVal) => {
    store.commit('updateReplicant', {
      name: replicant.name,
      value: clone(newVal),
    });
  });

  replicants.push(replicant);
});

export async function create(): Promise<Store<StoreTypes>> {
  return NodeCG.waitForReplicants(...replicants).then(() => store);
}
