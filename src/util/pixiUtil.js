import {Rectangle} from 'pixi.js';

const util = {};

util.intersects = (a, b) => {

  const r1 = a.getBounds();
  const r2 = b.getBounds();

  return !(
    r1.left > r2.right || r1.right < r2.left ||
    r1.top > r2.bottom || r1.bottom < r2.top
  );

}

util.intersection = (a, b) => {
  const x1 = Math.max(a.left, b.left);
  const y1 = Math.max(a.top, b.top);
  const x2 = Math.min(a.right, b.right);
  const y2 = Math.min(a.bottom, b.bottom);

  if (x2 < x1 || y2 < y1) {
    return Rectangle.EMPTY;
  } else {
    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
  }
}


export default util;
