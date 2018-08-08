import * as Pixi from 'pixi.js';
import {Sprite, Container, Texture} from 'pixi.js';
import TweenLite from 'TweenLite';

const defaults = {
  floorHeight: 150,
  floorSpacing: 100,
  elevatorSpeed: 150
}


class Elevator extends Container {

  constructor () {
    super();

    this._levels = 1;

    const top = Sprite.fromImage('elevator-top.png');
    this.addChild(top);

    this._shaft = this._addShaft(top.x, top.y + top.height);

    this._bottom = Sprite.fromImage('elevator-bottom.png');
    this.addChild(this._bottom);

    this._addCab();

    this._resize();
  }

  get levels () {
    return this._levels;
  }

  set levels (value) {
    this._levels = value;
    this._resize();
  }

  getLevelBottom (level = 0) {
    return this._shaft.y + level * (defaults.floorSpacing + defaults.floorHeight);
  }

  getLevelTop (level = 0) {
    return this.getLevelBottom(level) - defaults.floorHeight * (level == 0 ? 0 : 1);
  }

  _addShaft (x,y ) {
    const texture = Texture.fromImage('elevator-shaft.png');
    const shaft = new Pixi.extras.TilingSprite(texture, texture.width, 100);
    this.addChild(shaft);

    shaft.position.set(x, y);
    shaft.width = texture.width;

    return shaft;
  }

  _addCab () {
    const texture = Texture.fromImage('elevator-cables.png');
    const cables = new Pixi.extras.TilingSprite(texture, texture.width, 0);
    cables.y = this.getLevelTop(0);
    this.addChild(cables);

    const cab = Sprite.fromImage('elevator-cabin.png');
    cab.anchor.set(0.5, 0);
    cab.x = this._shaft.x + this._shaft.width / 2;
    this.addChild(cab);

    this._cabPos = new Pixi.ObservablePoint(() => {
      cab.y = this._cabPos.y;
      cables.height = cab.y - cables.y;
    }, this);

    this._cabPos.y = this.getLevelTop(0);

  }

  moveToLevel (level) {
    return new Promise((resolve) => {
      const distance = Math.abs(this._cabPos.y - this.getLevelTop(level));
      console.log(distance);
      if (distance > 0) {
        const duration = distance / defaults.elevatorSpeed;
        TweenLite.to(this._cabPos, duration, {
          y: this.getLevelTop(level),
          ease: Quart.easeInOut,
          onComplete: resolve
        });
      }
    });
  }

  _resize () {
    const bottom = this.getLevelBottom(this.levels);
    this._shaft.height = bottom - this._shaft.y;
    this._bottom.position.set(this._shaft.x, bottom);
  }


}

export default Elevator
