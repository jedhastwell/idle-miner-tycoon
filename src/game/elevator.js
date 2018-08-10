import * as Pixi from 'pixi.js';
import {Sprite, Container, Texture} from 'pixi.js';
import TweenLite from 'TweenLite';
import Anims from './animations.js';
import Core  from '../core.js';
import values from './values';


class Elevator extends Container {

  constructor () {
    super();
    this._levels = 1;
    this._amount = 0;
    this._populate();
    this._resize();
  }

  get levels () {
    return this._levels;
  }

  set levels (value) {
    this._levels = value;
    this._resize();
  }

  get amount () {
    return this._amount;
  }

  moveToLevel (level) {
    return new Promise((resolve) => {
      const distance = Math.abs(this._cabPos.y - Elevator.topForLevel(level));
      if (distance > 0) {
        const duration = distance / values.elevatorSpeed;
        TweenLite.to(this._cabPos, duration, {
          y: Elevator.topForLevel(level),
          ease: Linear.easeNone,
          onComplete: resolve
        });
      }
    });
  }

  collect (amount = 0, level = 0) {

    if (amount > 0) {
      Anims.set(this._worker, Anims.elevatorWorkerWorking, true);
    }

    Core.engine.wait(values.getMineUnloadTime(amount))
    .then(() => {
      Anims.set(this._worker, Anims.elevatorWorkerIdle, true);
      this._amount += amount;
      if (level < this._levels) {
        this.moveToLevel(level + 1).then(() => {
          this.emit('collecting', level + 1);
        })
      } else {
        this.moveToLevel(0).then(() => {
          this.emit('unloading', this.amount);
        })
      }
    });
  }

  _populate () {
    this._shaft = this._addShaft();

    this._bottom = Sprite.fromImage('elevator-bottom.png');
    this.addChild(this._bottom);

    this._addCab();

    const top = Sprite.fromImage('elevator-top.png');
    this.addChild(top);
  }

  _addShaft () {
    const texture = Texture.fromImage('elevator-shaft.png');
    const shaft = new Pixi.extras.TilingSprite(texture, texture.width, 100);
    this.addChild(shaft);

    shaft.width = texture.width;

    return shaft;
  }

  _addCab () {
    const texture = Texture.fromImage('elevator-cables.png');
    const cables = new Pixi.extras.TilingSprite(texture, texture.width, 0);
    this.addChild(cables);

    const cab = Sprite.fromImage('elevator-cabin.png');
    cab.anchor.set(0.5, 0.1);
    cab.x = this._shaft.x + this._shaft.width / 2;
    this.addChild(cab);

    this._cabPos = new Pixi.ObservablePoint(() => {
      cab.y = this._cabPos.y;
      cables.height = cab.y - cables.y;
    }, this);

    this._cabPos.y = Elevator.topForLevel(0);

    this._addWorker(cab);

    cab.interactive = true;
    cab.on('pointertap', () => {
      this.collect(0, 0);
    });

  }

  _addWorker (cab) {
    const worker = this._worker = Anims.make(Anims.elevatorWorkerIdle, true);
    worker.anchor.set(0.55, 1.1);
    worker.position.set(0, cab.height - (cab.height * cab.anchor.y));
    cab.addChild(worker);
  }

  _resize () {
    const bottom = Elevator.bottomForLevel(this.levels);
    this._shaft.height = bottom - this._shaft.y;
    this._bottom.position.set(this._shaft.x, bottom);
  }

}

Elevator.topForLevel = (level = 0) => {
  if (level > 0) {
    return values.firstLevelTop + (level - 1) * (values.levelHeight + values.levelSpacing);
  } else {
    return values.groundLevelTop;
  }
}

Elevator.bottomForLevel = (level = 0) => {
  return Elevator.topForLevel(level) + values.levelHeight;
}

export default Elevator
