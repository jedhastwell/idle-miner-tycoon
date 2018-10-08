import {Container, Sprite, Texture, Rectangle, Circle} from 'pixi.js';
import TimelineLite        from 'TimelineLite';
import util from '../util/util';
import core from '../core';

const defaults = {
  movementRange: 50
}

class PointerPool {

  constructor () {
    this._pool = [];
    this._active = [];

    this.autoClickSequence = [
      {weight: 3, timeout: 7.5},
      {weight: 0, timeout: 5.5},
      {weight: 1, timeout: 5.5},
      {weight: 2, timeout: 5.5}
      // Show end screen after another 5 seconds
    ];
  }

  preAllocate (count) {
    for (let i = 0; i < count; i++) {
      this._pool.push(new Pointer());
    }
  }

  acquire (weight) {
    let pointer = null;

    if (this._pool.length) {
      pointer = this._pool.pop();
    } else {
      pointer = new Pointer();
    }

    this._active.push(pointer);

    pointer.weight = weight;

    return pointer;
  }

  release (pointer) {
    const index = this._active.indexOf(pointer);

    if (index > -1) {
      this._active.splice(index, 1);
    }

    if (pointer.parent) {
      pointer.parent.removeChild(pointer);
    }

    pointer.expire();

    this._pool.push(pointer);
  }

  make(parent, x, y, weight, clickAction) {
    const pointer = this.acquire(weight);

    if (util.is.obj(parent) && util.is.fnc(parent.addChild)) {
      parent.addChild(pointer);
    }

    if (!util.is.nil(x)) {
      pointer.x = x;
    }

    if (!util.is.nil(y)) {
      pointer.y = y;
    }

    pointer.clickAction = clickAction;

    pointer.autoClickTimeout = -1;

    pointer.timeline.play(0);


    if (this.autoClickSequence.length && this.autoClickSequence[0].weight == weight) {
      pointer.autoClickTimeout = this.autoClickSequence[0].timeout;
      this.autoClickSequence.splice(0, 1);
    }
    
    return pointer;
  }

  update (elapsed) {
    for (const pointer of this._active) {
      if (pointer.autoClickTimeout > 0) {

        pointer.autoClickTimeout -= elapsed;

        if (pointer.autoClickTimeout <= 0) {

          pointer.showClick().then(() => {
            pointer.clickAction();
          });

        }
      }
    }

  }

  clickNext () {
    let pointer = null;

    const w = this._sequence [0];

    if (!util.is.nil(w)) {
      for (const p of this._active) {
        // if (!pointer || p.weight > pointer.weight) {
        if (p.weight == w) {
          pointer = p;
        }
      }
  
      if (pointer && util.is.fnc(pointer.clickAction)) {
        this._sequence.splice(0,1);
        pointer.showClick().then(() => {
          pointer.clickAction();
        });
        
      }

    }

  }

}


class Pointer extends Container {

  constructor () {

    super();

    this.weight = 0;
    this.autoClickTimeout = -1;

    const arrow = Sprite.fromImage('pointer.png');
    arrow.anchor.set(0.5, 0.8);
    arrow.y = -defaults.movementRange;
    this.addChild(arrow);

    const tl = this.timeline = new TimelineLite();

    tl.to(arrow, 0.35, {y: 0, width: arrow.texture.width * 0.7, ease: Quad.easeIn});
    tl.to(arrow, 0.18, {y: -defaults.movementRange * 0.25, width: arrow.texture.width * 0.9, ease: Quad.easeInOut});
    tl.to(arrow, 0.18, {y: 0, width: arrow.texture.width * 0.7, ease: Quad.easeInOut});
    tl.to(arrow, 0.8, {y: -defaults.movementRange, width: arrow.texture.width, ease: Quint.Out});
    tl.call(tl.play, [0], tl, '+=0.3');
    this.once('destroyed', tl.kill, tl);

    this.interactive = true;
    this.on('pointertap', (e) => {
      if (this.clickAction) {
        this.clickAction(e);
      }
    }, this);

    this.hitArea = new Circle(0, 0, arrow.width);

  }

  destroy () {
    this.emit('destroyed');
    super.destroy({children: true});
  }

  expire () {
    this.timeline.stop();
    this.emit('expired');
  }

  showClick () {
    return new Promise((resolve, reject) => {
      const hand = Sprite.fromImage('hand-1.png');
      hand.anchor.set(0.35, 0);
      hand.rotation = Math.PI * -0.25;

    
      const x = hand.width * 0.3;
      const y = hand.height * 0.1;

      const p = this.toGlobal({x: 0, y: 60});

      hand.position.set(p.x + x, p.y + y);

      let expired = false;
      let didClick = false;

      hand.alpha = 0;
      // this.addChild(hand);
      core.game._ui.addChild(hand);
      const tl = new TimelineLite();
      tl.to(hand, 0.1, {alpha: 1});
      tl.to(hand, 0.5, {x: p.x, y: p.y}, '+=0.3');
      tl.set(hand, {texture: Texture.fromImage('hand-2.png')}, '+=0.2');
      tl.set(hand, {texture: Texture.fromImage('hand-1.png')}, '+=0.15');

      tl.call(() => {
        if (!expired) {
          didClick = true;
          resolve();
        } else {
          hand.destroy();
          tl.kill();
        }
      });
      tl.to(hand, 0.4, {x: p.x + x, y: p.y + y});
      tl.to(hand, 0.3, {alpha: 0},'-=0.2');
      tl.call(hand.destroy, [], hand);

      this.once('expired', () => {
        if (!didClick) {
          hand.destroy();
          tl.kill();
        }
        expired = true;
      });

    });
  }


}

Pointer.pool = new PointerPool();

export default Pointer
