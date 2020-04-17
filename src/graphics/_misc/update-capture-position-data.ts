import { CapturePositions } from 'schemas';

export function updateCapturePositionData(layout: string): void {
  const capturePositions = nodecg.Replicant<CapturePositions>('capturePositions');
  NodeCG.waitForReplicants(capturePositions).then(() => {
    if (!capturePositions.value) {
      return;
    }
    const captureElems = document.getElementsByClassName('Capture');
    const pos: { [k: string]: { x: number; y: number; width: number; height: number}} = {};

    for (const el of captureElems) {
      const sizes = el.getBoundingClientRect();

      // Get the widths of all the borders to figure out the position/size without them.
      const topBorder = getComputedStyle(el).getPropertyValue('border-top-width');
      const rightBorder = getComputedStyle(el).getPropertyValue('border-right-width');
      const bottomBorder = getComputedStyle(el).getPropertyValue('border-bottom-width');
      const leftBorder = getComputedStyle(el).getPropertyValue('border-left-width');
      const calcSizes = {
        x: sizes.x + parseInt(leftBorder, 0),
        y: sizes.y + parseInt(topBorder, 0),
        width: sizes.width - parseInt(rightBorder, 0) - parseInt(leftBorder, 0),
        height: sizes.height - parseInt(bottomBorder, 0) - parseInt(topBorder, 0),
      };
      pos[el.id] = calcSizes;
    }

    capturePositions.value[layout] = pos;
  });
}
