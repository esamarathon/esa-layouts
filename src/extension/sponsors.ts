import clone from 'clone';
import { CurrentSponsorLogo, SponsorLogoRotation } from '../../schemas';
import * as nodecgApiContext from './util/nodecg-api-context';

// This stuff is done in an extension so it survives reloads/game layout changes.

const nodecg = nodecgApiContext.get();
const current = nodecg.Replicant<CurrentSponsorLogo>('currentSponsorLogo', { persistent: false });
const rotation = nodecg.Replicant<SponsorLogoRotation>('sponsorLogoRotation');
let index = 0;
let init = false;

rotation.on('change', (newVal) => {
  if (newVal && newVal.length && !init) {
    showNextLogo();
    init = true;
  }
});

nodecg.listenFor('clearSponsorLogoRotation', () => {
  rotation.value.length = 0;
});

function showNextLogo() {
  // If no logos to show, just wait 10s then check again.
  // (should recode this to be smarter)
  if (!rotation.value.length || !rotation.value[index]) {
    index = 0;
    setTimeout(showNextLogo, 10000);
    return;
  }

  current.value = clone(rotation.value[index]);
  setTimeout(showNextLogo, rotation.value[index].seconds * 1000);
  index += 1;
  if (rotation.value.length <= index) {
    index = 0;
  }
}
