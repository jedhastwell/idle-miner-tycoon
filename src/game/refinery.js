import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Core  from '../core.js';
import Anims from './animations.js';
import values from './values';
import CashLabel from '../ui/cashLabel.js';


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

    this._amountLabel = new CashLabel();
    this._amountLabel.position.set(building.width * 0.3, roof.y + roof.height  * 0.3);
    this.addChild(this._amountLabel);

    this.amount = 0;

  }

  get amount () {
    return this._amount;
  }

  set amount (value) {
    this._amount = value;
    this._amountLabel.value = values.getCash(this._amount);
  }

  collect (amount) {
    this.amount += amount;
  }

  unload () {
    const duration = values.getRefinaryUnloadTime(this.amount);

    this.emit('unloading', this.amount);

    this._pipe.play(0);
    Core.engine.wait(duration).then(() => {
      this._pipe.gotoAndStop(0);
    });

    this.amount = 0;
  }

  _addManager () {
    const manager = this._manager = Anims.make(Anims.managerExWorking);
    manager.anchor.set(0.5, 1);
    manager.position.set(86, -29);
    manager.play();
    this.addChild(manager);
  }

}

export default Refinery
