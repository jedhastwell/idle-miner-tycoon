import { Container } from "pixi.js";
import TextButton from "./textButton";
import CashButton from "./cashButton";
import core from "../core";
import Pointer from "../game/pointer";
import TotalCashLabel from "./totalCashLabel";
import values from "../game/values";

class UI extends Container {

  constructor (world) {
    super();
    
    this._world = world;

    this._populate();

    core.engine.on('resize', this._layout, this);
    this._layout();
  }

  _populate () {
    this._addButtons();
    this._addTotalCashLabel();
  }

  _addTotalCashLabel () {
    this._totalCashLabel = new TotalCashLabel();
    this.addChild(this._totalCashLabel);

    core.game.on('cashChanged', (cash) => {
      this._totalCashLabel.text = '' + cash + (values.targetCash >= 0 ? ' / ' + values.targetCash : '');
    })

  }

  _addButtons () {
    this._newShaftButton = new CashButton ('New Shaft' , 0);
    this._newShaftButton.on('pressed', () => {
      this._world.newLevel();
      this._newShaftButton.cost = 200;
      // this._newShaftButton.disabled = !this._world.newLevel();
    }, this._world);
    this.addChild(this._newShaftButton);

    this._newManagerButton = new CashButton ('Manager', 100);
    this._newManagerButton.on('pressed', this._world.newManager, this._world);
    this.addChild(this._newManagerButton);

    // this._newManagerButton.on('stateChanged', (e) => {
    //   if (e.oldState == Button.State.Disabled) {

    //   }
    // });

  }

  _layout () {
    const size = core.engine.screen;

    this._newShaftButton.x = size.width * 0.7 - (this._newShaftButton.width * 0.5);
    this._newShaftButton.y = size.height - 40 - (this._newShaftButton.height);

    this._newManagerButton.x = size.width * 0.3 - (this._newManagerButton.width * 0.5);
    this._newManagerButton.y = size.height - 40 - (this._newManagerButton.height);

    this._totalCashLabel.x = size.width * 0.5 - this._totalCashLabel.width * 0.5;
    this._totalCashLabel.y = 20;

  }

}

export default UI