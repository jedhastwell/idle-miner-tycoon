import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Core  from '../core.js';
import Anims from './animations.js';
import values from './values';


class Refinery extends Container {

  constructor () {
    super();

    const building = Sprite.fromImage('booth-window.png');
    building.position.set(0, -building.height);
    this.addChild(building);

    const roof = Sprite.fromImage('booth-top.png');
    roof.position.set(0, building.y - roof.height);
    this.addChild(roof);

    const pipe = this._pipe = Anims.make(Anims.pipe);
    pipe.position.set(roof.width, roof.y + roof.height * 0.4);4
    this.addChild(pipe);

    this._amount = 0;

  }

  get amount () {
    return this._amount;
  }

  collect (amount) {
    this._amount += amount;
  }

  unload () {
    const duration = values.getRefinaryUnloadTime(this.amount);

    this.emit('unloading', this.amount);

    this._pipe.play(0);
    Core.engine.wait(duration).then(() => {
      this._pipe.gotoAndStop(0);
    });

    this._amount = 0;
  }


}

export default Refinery
