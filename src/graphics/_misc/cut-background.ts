import { makeCoors, outputCss, sortBoxCoor } from './clip';
import type { BoxCoor } from './clip';

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

  return outputCss(makeCoors(1920, 1080, coordsArr));
}
