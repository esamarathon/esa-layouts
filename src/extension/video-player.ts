import clone from 'clone';
import * as nodecgApiContext from './util/nodecg-api-context';

const nodecg = nodecgApiContext.get();
const videos = nodecg.Replicant<any[]>('assets:videos');
const currentSum = nodecg.Replicant<string | undefined>('currentVideoSum');
const currentObj = nodecg.Replicant<object | undefined>('currentVideoObj');

currentSum.on('change', (newVal) => {
  if (newVal && videos && videos.length) {
    currentObj.value = clone(findVideoBySum(newVal));
  } else {
    currentObj.value = undefined;
  }
});

videos.on('change', (newVal) => {
  if (newVal && newVal.length && currentSum.value) {
    currentObj.value = clone(findVideoBySum(currentSum.value));
  } else {
    currentObj.value = undefined;
  }
});

// Finds a video with the supplied checksum.
function findVideoBySum(sum: string) {
  let videoInfo;

  for (let i = 0; i < videos.value.length; i += 1) {
    if (videos.value[i].sum === sum) {
      videoInfo = videos.value[i];
      break;
    }
  }

  return videoInfo;
}
