import clone from 'clone';
import { CurrentSponsorLogo } from '../../schemas';
import * as nodecgApiContext from './util/nodecg-api-context';

// This stuff is done in an extension so it survives reloads/game layout changes.

const nodecg = nodecgApiContext.get();
const current = nodecg.Replicant<CurrentSponsorLogo>('currentSponsorLogo', { persistent: false });
const logos = nodecg.Replicant<any[]>('assets:sponsor-logos');
let index = 0;
let init = false;

logos.on('change', (newVal) => {
  if (newVal && newVal.length && !init) {
    showNextLogo();
    init = true;
  }
});

function showNextLogo() {
  // If no logos to show, just wait 10s then check again.
  // (should recode this to be smarter)
  if (!logos.value.length || !logos.value[index]) {
    current.value = {};
    index = 0;
    setTimeout(showNextLogo, 10000);
    return;
  }

  current.value = clone(logos.value[index]);
  setTimeout(showNextLogo, 60 * 1000);
  index += 1;
  if (logos.value.length <= index) {
    index = 0;
  }
}
