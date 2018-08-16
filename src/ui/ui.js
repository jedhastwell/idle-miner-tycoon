import { Container } from "pixi.js";
import TextButton from "./textButton";
import CashButton from "./cashButton";
import core from "../core";
import Pointer from "../game/pointer";
import TotalCashLabel from "./totalCashLabel";
import values from "../game/values";
import effects from "../game/effects";

class UI extends Container {

  constructor (world) {
    super();
    
    this._world = world;

    this._populate();

    core.engine.on('resize', this._layout, this);
    this._layout();

  }

  levelCompleteSequence () {
    effects.coinRain(this, 0, -50, core.engine.screen.width);

    return core.engine.wait(2);    
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
    const shaftBtn = this._shaftBtn = new CashButton ('New Shaft' , values.getMineshaftCost(1));

    shaftBtn.shouldDisable = () => {
      return !this._world.levelVacancies();
    }

    shaftBtn.on('pressed', () => {
      this._world.newLevel();
      managerBtn._check();
      shaftBtn.cost = values.getMineshaftCost(this._world.levelCount + 1);
    }, this._world);
    this.addChild(shaftBtn);
    

    const managerBtn = this._managerBtn = new CashButton ('Manager', values.getManagerCost(1));

    managerBtn.on('pressed', () => {
      this._world.newManager()
      managerBtn.cost = values.getManagerCost(this._world.managerCount + 1);
    });

    managerBtn.shouldDisable = () => {
      return !this._world.managerVacancies();
    }

    this.addChild(managerBtn);

    this._attachPointer(shaftBtn);
    this._attachPointer(managerBtn);
  }


  _attachPointer (button) {
    const pointer = new Pointer();
    pointer.position.set(button.width / 2, 0);
    button.addChild(pointer);

    pointer.visible = !button.disabled;

    button.on('stateChanged', (e) => {
      pointer.visible = !button.disabled;
    });
  }

  _layout () {
    const size = core.engine.screen;

    this._shaftBtn.x = size.width * 0.7 - (this._shaftBtn.width * 0.5);
    this._shaftBtn.y = size.height - 40 - (this._shaftBtn.getBounds().bottom - this._shaftBtn.y);

    this._managerBtn.x = size.width * 0.3 - (this._managerBtn.width * 0.5);
    this._managerBtn.y = size.height - 40 - (this._managerBtn.getBounds().bottom - this._managerBtn.y);

    this._totalCashLabel.x = size.width * 0.5 - this._totalCashLabel.width * 0.5;
    this._totalCashLabel.y = 20;
  }

}

export default UI