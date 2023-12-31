import * as Pixi from 'pixi.js';
import {Sprite, Container, Texture} from 'pixi.js';
import Building from './building';
import TweenLite from 'TweenLite';
import Anims from './animations.js';
import Core  from '../core.js';
import values from './values';
import CashLabel from '../ui/cashLabel.js';
import util from '../util/util.js';
import Pointer from './pointer.js';

class Elevator extends Building {

  constructor () {
    super();
    this._levels = 1;
    this._disabled = true;
    this._populate();
    this._resize(true);
  }

  get levels () {
    return this._levels;
  }
  set levels (value) {
    if (this._levels !== value) {
      this._levels = value;
      this._resize();
    }
  }

  get disabled () {
    return this._disabled;
  }
  set disabled (value) {
    this._disabled = value;
  }

  reset () {
    this._moveToLevel(0);
    this._levels = 1;
    this._disabled = true;
    this._resize(true);
    super.reset();
  }

  _addManager () {
    return true;
  }

  _moveToLevel (level) {
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

  work () {
    if (!this.disabled) {
      super.work();
    }
  }

  _work () {
    this.collect(0, 0);
  }

  collect (amount = 0, level = 0) {
    
    if (amount > 0) {
      Anims.set(this._worker, Anims.elevatorWorkerWorking, true);
      this._updateLoad(this.amount + amount, level);
    }

    this.amount += amount;

    Core.engine.wait(values.getMineUnloadTime(amount))
    .then(() => {
      Anims.set(this._worker, Anims.elevatorWorkerIdle, true);
      
      if (level < this.levels) {
        this._moveToLevel(level + 1).then(() => {
          this.emit('collecting', level + 1);
        })
      } else {
        this._moveToLevel(0).then(() => {
          this.unload();
          this.idle();
        })
      }
    });
  }

  _addPointer () {
    return Pointer.pool.make(this, 
      this._worker.parent.x + this._worker.x, 
      this._worker.parent.y + this._worker.y - this._worker.height, 
      1, this.click.bind(this), 
      values.tooltipElevator);
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

    this._addLoad(cab);
    this._addWorker(cab);
    this.addAmountLabel(cab, 0, 8);

    cab.interactive = true;
    cab.on('pointertap', this.click, this);

  }

  _addWorker (cab) {
    const worker = this._worker = Anims.make(Anims.elevatorWorkerIdle, true);
    worker.anchor.set(0.55, 1.1);
    worker.position.set(0, cab.height - (cab.height * cab.anchor.y));
    cab.addChild(worker);
  }

  _addLoad (cab) {
    const load = this._load = Sprite.fromImage('elevator-load-gold-1.png');
    load.anchor.set(0.5, 1);
    load.position.set(
      cab.width / 2 - cab.width * cab.anchor.x, 
      cab.height - 13 - cab.height * cab.anchor.y
    );
    load.visible = false;
    cab.addChild(load);

    this.on(Building.Events.AmountChanged, (value) => {
      this._load.visible = value > 0;
    });
  }

  _updateLoad (amount, level) {
    const i = util.limitNum(Math.round((amount / values.elevatorFullLoadAmount) * 2) + 1, 1, 3);
    const imgType = ['gold', 'amethyst', 'jade'][util.limitNum(level - 1, 0, 2)];
    this._load.texture = Texture.from(`elevator-load-${imgType}-${i}.png`);
  }

  _resize (instant) {
    const duration = instant ? 0 : values.elevatorResizeTime;
    const bottom = Elevator.bottomForLevel(this.levels);
    TweenLite.to(this._shaft, duration, {height: bottom - this._shaft.y});
    TweenLite.to(this._bottom, duration, {y: bottom});
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
