import {Container} from 'pixi.js';
import CashLabel from '../ui/cashLabel';
import values from './values';

class Building extends Container {

  constructor () {
    super();

    this._manager = null;
    this._pointer = null;
    this._amount = 0;
    this._working = false;

  }

  get amount () {
    return this._amount;
  }

  set amount (value) {
    this._amount = value;
    this.emit(Building.Events.AmountChanged, this.amount);
  }

  addAmountLabel (parent, x, y, hideWhenEmpty) {
    // Add cash label.
    const amountLabel = new CashLabel(values.getCash(this.amount), true);
    parent.addChild(amountLabel);

    // Set properties.
    amountLabel.position.set(x, y);
    amountLabel.visible = !hideWhenEmpty || this.amount > 0;

    // Update value when amount changes.
    this.on(Building.Events.AmountChanged, (value) => {
      amountLabel.value = values.getCash(value);
      amountLabel.visible = !hideWhenEmpty || value > 0;
    });

    return amountLabel;
  }

  addManager () {
    if (!this.hasManager) {
      this._manager = this._addManager();
      console.assert(this.hasManager, "Failed to add manager");
      this.promptWork();
    }
  }

  get hasManager () {
    return !!this._manager;
  }

  promptWork () {
    if (!this._working) {
      if (this.hasManager) {
        this.work();
      } else {
        if (!this._pointer) {
          this._pointer = this._addPointer();
          console.assert(!!this._pointer, "Failed to add pointer");
        }
      }
    }
  }

  work () {
    if (!this._working) {

      if (this._pointer) {
        this._pointer.destroy();
        this._pointer = null;
      }

      this._working = true;
      this._work();
    }
  }

  idle () {
    this._working = false;
    this.emit(Building.Events.Idle);
  }

  collect (amount) {
    this.amount += amount;
  }

  unload () {
    this.emit(Building.Events.Unloading, this.amount);
    this.amount = 0;
  }

  _addManager () { throw "Call to abstract method. Override required." }

  _addPointer () { throw "Call to abstract method. Override required." }

  _work () { throw "Call to abstract method. Override required." }
  

}

Building.Events = {
  Idle: 'idle',
  Collecting: 'collecting',
  Unloading: 'unloading',
  AmountChanged: 'amountChanged'
}

export default Building