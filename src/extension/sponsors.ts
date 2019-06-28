import * as nodecgApiContext from './util/nodecg-api-context';

// This stuff is done in an extension so it survives reloads/layout changes.

const nodecg = nodecgApiContext.get();
const logos = nodecg.Replicant<any[]>('assets:sponsor-logos');
const current = nodecg.Replicant('currentSponsorLogo', { persistent: false });
let index = 0;
let init = false;

logos.on('change', (newVal) => {
  if (newVal && newVal.length && !init) {
    showNextLogo();
    setInterval(showNextLogo, 10000);
    init = true;
  }
});

function showNextLogo() {
  current.value = logos.value[index].url;
  index += 1;
  if (logos.value.length <= index) {
    index = 0;
  }
}
