/* eslint-disable object-curly-newline */
/* eslint-disable import/prefer-default-export */

import { BoxCoor, Coor, makeCoors, outputCss, sortBoxCoor } from './clip';

export function generateClipPath(): string {
  const captureElems = document.getElementsByClassName('Capture');
  const coordsArr: Coor[][] = [];

  Array.from(captureElems).forEach((el) => {
    const sizes = el.getBoundingClientRect();
    const coords: BoxCoor = [
      [sizes.x, sizes.y],
      [sizes.right, sizes.y],
      [sizes.x, sizes.bottom],
      [sizes.right, sizes.bottom],
    ];
    coordsArr.push(sortBoxCoor(coords));
  });

  const css = outputCss(
    makeCoors(1920, 1080, coordsArr),
  );
  return css;
}
