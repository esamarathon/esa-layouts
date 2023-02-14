import clone from 'clone';
import { get as nodecg } from './util/nodecg';
import { intermissionSlides } from './util/replicants';

async function showNext(): Promise<void> {
  // If nothing in the rotation anymore, just stop for now.
  if (!intermissionSlides.value.rotation.length) {
    intermissionSlides.value.current = null;
    return;
  }
  const lastIndex = intermissionSlides.value.rotation
    .findIndex((r) => r.id === intermissionSlides.value.current?.id);
  let nextIndex = lastIndex + 1;
  if (intermissionSlides.value.rotation.length - 1 < nextIndex) nextIndex = 0;
  const next = intermissionSlides.value.rotation[nextIndex];
  intermissionSlides.value.current = clone(next);
  nodecg().log.debug('[Intermission Slides] Will now show slide of type:', next.type);
}

intermissionSlides.on('change', (newVal, oldVal) => {
  // If nothing is currently being shown, and the rotation is filled from being empty,
  // trigger the cycle to start up again.
  if (!newVal.current && oldVal && newVal.rotation.length && !oldVal.rotation.length) {
    showNext();
  }
});

// Listens for messages from the graphic to change to the next slide.
nodecg().listenFor('intermissionSlidesShowNext', (data, ack) => {
  showNext();
  if (ack && !ack?.handled) ack();
});
