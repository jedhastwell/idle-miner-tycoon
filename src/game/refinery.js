import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Building from './building';
import core  from '../core.js';
import Anims from './animations.js';
import values from './values';
import CashLabel from '../ui/cashLabel.js';


class Refinery extends Building {

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

    this.addAmountLabel(this, building.width * 0.5, roof.y + roof.height  * 0.3);

  }


  unload () {
    const duration = values.getRefinaryUnloadTime(this.amount);

    super.unload();

    this._pipe.play(0);
    core.engine.wait(duration).then(() => {
      this._pipe.gotoAndStop(0);
    });
  }

  _addManager () {
    const manager = this._manager = Anims.make(Anims.managerExWorking);
    manager.anchor.set(0.5, 1);
    manager.position.set(86, -29);
    manager.play();
    this.addChild(manager);
    return manager;
  }

  _work () {}

}

export default Refinery
