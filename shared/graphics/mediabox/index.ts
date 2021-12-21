import { setUpReplicants } from '../../browser_shared/replicant_store';
import App from './App.vue';
import store from './store';
export default App;
export async function setUpReplicantsComponent(): Promise<void> {
  await setUpReplicants(store);
}
