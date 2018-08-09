import {Container, Sprite} from 'pixi.js';
import TimelineLite        from 'TimelineLite';

const defaults = {
  movementRange: 50
}

class Pointer extends Container {

  constructor () {

    super();

    const arrow = Sprite.fromImage('pointer.png');
    arrow.anchor.set(0.5, 0.8);
    arrow.y = -defaults.movementRange;
    this.addChild(arrow);

    const tl = new TimelineLite();

    tl.to(arrow, 0.35, {y: 0, width: arrow.texture.width * 0.7, ease: Quad.easeIn});
    tl.to(arrow, 0.18, {y: -defaults.movementRange * 0.25, width: arrow.texture.width * 0.9, ease: Quad.easeInOut});
    tl.to(arrow, 0.18, {y: 0, width: arrow.texture.width * 0.7, ease: Quad.easeInOut});
    tl.to(arrow, 0.8, {y: -defaults.movementRange, width: arrow.texture.width, ease: Quint.Out});
    tl.call(tl.play, [0], tl, '+=0.3');
    this.on('destroyed', tl.kill);
  }

  destroy () {
    this.emit('destroyed');
    super.destroy({children: true});
  }

}

export default Pointer
