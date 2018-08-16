import {Texture, Text} from 'pixi.js';
import Button          from './button.js';

class TextButton extends Button {

  constructor (text = '') {
    super(Texture.fromImage('ui-button.png'), {
      disabledTexture: Texture.fromImage('ui-button-disabled.png')
    });

    this._textLabel = new Text(text,  {
      fontFamily : 'LeageSpartan',
      fontSize: 34,
      fill : 0xffffff,
      strokeThickness: 6,
      wordWrap: true,
      wordWrapWidth: this.width - 10,
      align: 'center',
      lineHeight: 44
    });

    this._textLabel.anchor.set(0.5, 0.5);
    this._textLabel.position.set(0, 0);
    this.sprite.addChild(this._textLabel);

    Button.attachScaleBehavior(this);
  }

  get text () {
    return this._textLabel.text;
  }
  
  set text (value) {
    this._textLabel.text = value;
  }

  set disabled(value) {
    super.disabled = value;
    this._textLabel.alpha = value ? 0.7 : 1;
  }
  
  get disabled () {
    return super.disabled;
  }

}

export default TextButton