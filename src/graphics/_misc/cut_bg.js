import * as Clip from './clip';

// Trigger whenever you want to create a clip-path to remove the
// capture area(s) from the background.
function CutBackground() {
  const captureElems = document.getElementsByClassName('Capture');
  const coordsArr = [];

  Array.from(captureElems).forEach((el) => {
    const sizes = el.getBoundingClientRect();
    const coords = [
      [sizes.x, sizes.y],
      [sizes.right, sizes.y],
      [sizes.x, sizes.bottom],
      [sizes.right, sizes.bottom],
    ];
    coordsArr.push(Clip.sortBoxCoor(coords));
  });

  const css = Clip.outputCss(
    Clip.makeCoors(1920, 1080, coordsArr),
  );
  document.getElementById('Background').style = css;
}

export default CutBackground;
