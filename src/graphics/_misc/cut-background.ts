import type { BoxCoor } from './clip';
import { makeCoors, outputCss, sortBoxCoor } from './clip';

const config = nodecg.bundleConfig;

// eslint-disable-next-line import/prefer-default-export
export function generateClipPath(): string {
  const captureElems = document.getElementsByClassName('Capture');

  const coordsArr = Array.from(captureElems).map((el) => {
    const sizes = el.getBoundingClientRect();
    const coords: BoxCoor = [
      [sizes.x, sizes.y],
      [sizes.right, sizes.y],
      [sizes.x, sizes.bottom],
      [sizes.right, sizes.bottom],
    ];
    return sortBoxCoor(coords);
  });

  return outputCss(makeCoors(
    config.obs.canvasResolution.width,
    config.obs.canvasResolution.height,
    coordsArr,
  ));
}
