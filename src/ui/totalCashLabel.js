import {Sprite, Texture, Text} from 'pixi.js';

class TotalCashLabel extends Sprite {

  constructor () {
    super(Texture.fromImage('ui-top-cash.png'));

    this._label = new Text('0',  {
      fontFamily : 'LeageSpartan',
      fontSize: 30,
      fill : 0xffffff,
      strokeThickness: 6,
      align: 'center'
    });
    this._label.anchor.set(0.5, 0.5);
    this._label.position.set(this.width / 2 + 20, this.height / 2 + 2);
    this.addChild(this._label);

    this.value = 0;
  }

  get text () {
    return this._label.text;
  }

  set text (value) {
    this._label.text = value;
  }

}

export default TotalCashLabel
