import CashLabel  from './cashLabel';
import TextButton from './textButton.js';
import core from '../core';

class CashButton extends TextButton {

  constructor (text, cost = 0) {
    super(text);

    // Reposition text label.
    this._textLabel.y = this.sprite.height * -0.25;

    // Create label for cost.
    this._costLabel = new CashLabel();
    this._costLabel.scale.set(1);
    this.sprite.addChild(this._costLabel);
    this.cost = cost;
    core.game.on('cashChanged', this._check, this);
    this.on('pressed', () => {
      core.game.cash -= this.cost;
    });
  }

  get cost () {
    return this._cost;
  }

  set cost (value) {
    this._cost = value;
    this._costLabel.value = '' + value;
    this._layout();
    this._check();
  }

  _layout () {
    let b = this._costLabel.getBounds();
    this._costLabel.position.set(- b.width * 0.55, 5);
  }

  _check () {
    this.disabled = core.game.cash < this.cost;
  }

  set disabled(value) {
    super.disabled = value;
    this._costLabel.alpha = value ? 0.7 : 1;
    this._costLabel.children[0].style.fill = value ? 0xFF0000 : 0xFFFFFF;
	}

}

export default CashButton
