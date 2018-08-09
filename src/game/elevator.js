import * as Pixi from 'pixi.js';
import {Sprite, Container, Texture} from 'pixi.js';
import TweenLite from 'TweenLite';

const defaults = {
  elevatorSpeed: 160,
  groundLevelTop: 54,
  firstLevelTop: 180,
  levelSpacing: 100,
  levelHeight: 159
}


class Elevator extends Container {

  constructor () {
    super();

    this._levels = 1;

    this._shaft = this._addShaft();

    this._bottom = Sprite.fromImage('elevator-bottom.png');
    this.addChild(this._bottom);

    this._addCab();

    const top = Sprite.fromImage('elevator-top.png');
    this.addChild(top);

    this._resize();
  }

  get levels () {
    return this._levels;
  }

  set levels (value) {
    this._levels = value;
    this._resize();
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

    this.moveToLevel(2);
  }

  moveToLevel (level) {
    return new Promise((resolve) => {
      const distance = Math.abs(this._cabPos.y - Elevator.topForLevel(level));
      if (distance > 0) {
        const duration = distance / defaults.elevatorSpeed;
        TweenLite.to(this._cabPos, duration, {
          y: Elevator.topForLevel(level),
          ease: Linear.easeNone,
          onComplete: resolve
        });
      }
    });
  }

  _resize () {
    const bottom = Elevator.bottomForLevel(this.levels);
    this._shaft.height = bottom - this._shaft.y;
    this._bottom.position.set(this._shaft.x, bottom);
  }

}

Elevator.topForLevel = (level = 0) => {
  if (level > 0) {
    return defaults.firstLevelTop + (level - 1) * (defaults.levelHeight + defaults.levelSpacing);
  } else {
    return defaults.groundLevelTop;
  }
}

Elevator.bottomForLevel = (level = 0) => {
  return Elevator.topForLevel(level) + defaults.levelHeight;
}

export default Elevator
