import {Sprite, Texture, Text} from 'pixi.js';

class CashLabel extends Sprite {

  constructor (value = 0, centerAlign = false) {
    super(Texture.fromImage('ui-coin.png'));

    this._centerAlign = centerAlign;

    this._label = new Text('0',  {
      fontFamily : 'LeageSpartan',
      fontSize: 34,
      fill : 0xffffff,
      strokeThickness: 6
    });
    this._label.anchor.set(0, 0.5);
    this._label.position.set(this.width + 10, this.height / 2 -2);
    this.addChild(this._label);

    this.value = value;
    this.scale.set(0.8, 0.8);
    this._layout();
  }

  get value () {
    return this._value;
  }

  set value (newValue) {
    this._value = newValue;
    this._label.text = newValue;
    this._layout();
  }

  _layout () {
    if (this._centerAlign) {
      this.pivot.x = this.getBounds().width / 2 + 10;
    }
  }

}

export default CashLabel
