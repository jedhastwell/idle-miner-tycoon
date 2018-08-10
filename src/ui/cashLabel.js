import {Sprite, Texture, Text} from 'pixi.js';

class CashLabel extends Sprite {

  constructor () {
    super(Texture.fromImage('ui-coin.png'));

    this._label = new Text('0',  {
      fontFamily : 'LeageSpartan',
      fontSize: 34,
      fill : 0xffffff,
      strokeThickness: 6
    });
    this._label.anchor.set(0, 0.5);
    this._label.position.set(this.width + 10, this.height / 2 -2);
    this.addChild(this._label);

    this.value = 0;
    this.scale.set(0.8, 0.8);
  }

  get value () {
    return this._value;
  }

  set value (newValue) {
    this._value = newValue;
    this._label.text = newValue;
  }

}

export default CashLabel
