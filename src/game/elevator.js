import {Sprite, Container} from 'pixi.js';

class Elevator extends Container {

  constructor (levelHeight) {
    super();

    this._levels = 1;
    this._levelHeight = levelHeight;

    const top
  }

  get levels () {
    return this._levels;
  }

  set levels (value) {
    this._levels = value;
  }


}

export default Elevator
