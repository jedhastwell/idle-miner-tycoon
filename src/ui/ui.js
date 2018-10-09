import { Texture, Container, Text, Sprite, Graphics } from "pixi.js";
import Button from "./button";
import CashButton from "./cashButton";
import core from "../core";
import Pointer from "../game/pointer";
import TotalCashLabel from "./totalCashLabel";
import values from "../game/values";
import effects from "../game/effects";
import TimelineLite from 'TimelineLite';
import TweenLite from 'TweenLite';
import {Circ} from 'Easing';
import pixiUtil from '../util/pixiUtil';


class UI extends Container {

  constructor (world) {
    super();
    
    this._world = world;

    this._disabled = false;

    this._populate();

    core.engine.on('resize', this._layout, this);
    this._layout();

  }

  levelCompleteSequence () {
    const screen = core.engine.screen;

    const showEndText = () => {
      const words = values.gameOverText.split(" ");
      const h = 95;
  
      words.map((word, i) => {
        const label = new Text(word, {
          fontFamily : 'LeageSpartan',
          fontSize: 80,
          fill : 0xEA9A02,
          stroke: 0xF7EC00,
          strokeThickness: 10,
          align: 'center'
        });
  
        label.anchor.set(0.5, 0.5);
        label.x = (screen.width * 0.5) + (screen.width * ((i % 2 == 0) ? -1 : 1));
        label.y = (screen.height *0.47) - (words.length * h / 2) + (i * h);
  
        const tl = new TimelineLite();
        tl.to(label, 0.45, {x: screen.width / 2, ease: Circ.easeIn});
        tl.to(label.scale, 0.3, {x: 10, y: 10, ease: Quad.easeIn}, '+=1');
        tl.to(label, 0.15, {alpha: 0}, '-=0.15');
        tl.call(() => {
          label.destroy();
          tl.kill();
        });
  
        this.addChild(label);
      });
    }

    const seq = new TimelineLite();
    seq.call(this._totalCashLabel.flash, [3], this._totalCashLabel);
    seq.call(() => {
      effects.coinRain(this, 0, -50, screen.width);
      this.showDimmer();
    }, [], this, '+=0.8');
    seq.call(showEndText, [], this);

    return core.engine.wait(2.5);    
  }

  introSequence () {
    return new Promise((resolve, reject) => {

      const container = new Container();
      this.addChild(container);

      const char = Sprite.fromImage('intro-guy-1.png');
      char.anchor.set(0, 1);
      char.x = - (char.width + 10);
      container.addChild(char);

      const bubble = Sprite.fromImage('speech-bubble.png');
      bubble.anchor.set(0, 0.75);
      bubble.position.set(char.width - 60, - char.height + 250);
      bubble.scale.set(0.1);
      bubble.alpha = 0;
      container.addChild(bubble);

      const label = new Text(values.introText, {
        fontFamily : 'LeageSpartan',
        fontSize: 30,
        fill : 0xFFFFFF,
        stroke: 0x000000,
        strokeThickness: 6,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: bubble.texture.width * 0.7
      });
      label.position.set (170, -50);
      label.anchor.set (0.5, 0.5);
      bubble.addChild(label);

      this.showDimmer();
      const show = new TimelineLite();
      show.to(char, 0.2, {x: -30, ease: Quad.easeIn}, '+=0.5');
      show.set(bubble, {alpha: 1}, '+=0.25');
      show.to(bubble.scale, 0.2, {x: 1, y: 1, ease: Quad.easeInOut});
      show.call(this._attachButtonPointers.bind(this));
    
      const layout = () => {
        container.position.set(0, core.engine.screen.height);
      }
      layout();
      core.engine.on('resize', layout, this);

      const clickShaftBtn = (e) => {
        this._shaftBtn.emit('pressed', this._shaftBtn, e);
      }

      this._dimmer.interactive = true;
      this._dimmer.on('pointertap', clickShaftBtn, this);

      this._world.once('newLevel', () => {
        show.kill();
        this._attachButtonPointers();
        core.engine.off('resize', layout, this);
        this._dimmer.off('pointertap', clickShaftBtn, this);
        this._dimmer.interactive = false;

        const hide = new TimelineLite();
        hide.call(resolve, [], this);
        hide.to(bubble, 0.15, {alpha: 0});
        hide.to(char, 0.2, {x: -char.width - 10, ease: Quad.easeOut}, '-=0.1');
        hide.call(this.hideDimmer, [], this, '-=0.15');
        hide.call(container.destroy, [{children: true}], container, '+=0.5');
      }, this);


    });
  }

  get disabled () {
    return this._disabled;
  }

  set disabled (value) {
    this._disabled = value;
    this._shaftBtn._check();
    this._managerBtn._check();
  }

  reset () {
    this._disabled = false;
    this._shaftBtn.cost = values.getMineshaftCost(this._world.levelCount + 1);
    this._managerBtn.cost = values.getManagerCost(this._world.managerCount + 1);
  }

  _populate () {

    if (values.inGameCta) {
      const ctaBtn = this._ctaBtn = new Button(Texture.fromImage('ui-button-cta.png'))
      ctaBtn.on('pressed', PlayableKit.open);
      this.addChild(ctaBtn);
    }

    this._dimmer = new Graphics();
    this._dimmer.beginFill(0x000000);
    this._dimmer.drawRect(0, 0, 10, 10);
    this._dimmer.alpha = 0;
    this._dimmer.visible = false;
    this.addChild(this._dimmer);

    this._addButtons();
    this._addTotalCashLabel();
  }

  _addTotalCashLabel () {
    this._totalCashLabel = new TotalCashLabel();
    this.addChild(this._totalCashLabel);

    core.game.on('cashChanged', (cash) => {
      this._totalCashLabel.text = '' + cash + (values.targetCash >= 0 ? ' / ' + values.targetCash : '');
    })
    core.game.emit('cashChanged', core.game.cash);
  }

  showDimmer (immediately) {
    this._dimmer.visible = true;
    if (immediately) {
      this._dimmer.alpha = 0.4;
    } else {
      this._dimmer.alpha = 0;
      TweenLite.to(this._dimmer, 0.5, {alpha: 0.4});
    }
  }

  hideDimmer () {
    const tl = new TimelineLite();
    tl.to(this._dimmer, 0.2, {alpha: 0});
    tl.set(this._dimmer, {visible: false});
  }

  _addButtons () {
    const shaftBtn = this._shaftBtn = new CashButton (values.newShaftText , values.getMineshaftCost(1));

    shaftBtn.shouldDisable = () => {
      return !this._world.levelVacancies() || this._disabled;
    }

    shaftBtn.on('pressed', (btn, clickEvent) => {
      if (clickEvent) {
        core.game.interact();
      }
      this._world.newLevel();
    }, this._world);

    this._world.on('newLevel', () => {
      managerBtn._check();
      shaftBtn.cost = values.getMineshaftCost(this._world.levelCount + 1);
    })

    core.game.on()

    this.addChild(shaftBtn);
    

    const managerBtn = this._managerBtn = new CashButton (values.newManagerText, values.getManagerCost(1));

    managerBtn.on('pressed', (btn, clickEvent) => {
      if (clickEvent) {
        core.game.interact();
      }
      
      this._world.newManager()
      managerBtn.cost = values.getManagerCost(this._world.managerCount + 1);
    });

    managerBtn.shouldDisable = () => {
      return !this._world.managerVacancies() || this._disabled;
    }

    this.addChild(managerBtn);
    
  }

  _attachButtonPointers () {
    if (!this._pointersAttached) {
      this._pointersAttached = true;
      this._attachPointer(this._shaftBtn, 3);
      this._attachPointer(this._managerBtn, 4);
    }
  }

  _attachPointer (button, weight) {
    
    if (!button.disabled && !button.pointer) {
      button.pointer = Pointer.pool.make(button, button.width / 2, 0, weight, (e) => {button.emit('pressed', button, e)});
      button.pointer.autoClickTimeout = values.autoClickTimeout;
    }

    button.on('stateChanged', (e) => {

      if (e.oldState == Button.State.DISABLED) {
        if (!button.pointer) {
          button.pointer = Pointer.pool.make(button, button.width / 2, 0, weight, (e) => {button.emit('pressed', button, e)});
        }
      }

      if (e.newState == Button.State.DISABLED) {
        if (button.pointer) {
          Pointer.pool.release(button.pointer);
          button.pointer = null;
        }
      }
    });
  }

  _layout () {
    let size = core.engine.screen;

    const buttons = [this._managerBtn, this._shaftBtn];

    if (this._ctaBtn) {
      buttons.unshift(this._ctaBtn);
      this._ctaBtn.y = size.height - 10 - this._ctaBtn.sprite.height;
    }

    const buttonSpan = buttons
    .map(btn => btn.sprite.width)
    .reduce((prev, current) => {
      return prev + current
    });

    const space = (size.width - buttonSpan) / (buttons.length + 1);

    let x = space;
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].x = x;
      x+= buttons[i].width + space;
    }

    this._shaftBtn.y = size.height - 40 - this._shaftBtn.sprite.height;
    this._managerBtn.y = size.height - 40 -  this._managerBtn.sprite.height;

    this._totalCashLabel.x = size.width * 0.5 - this._totalCashLabel.width * 0.5;
    this._totalCashLabel.y = 20;

    this._dimmer.width = size.width;
    this._dimmer.height = size.height;
  }

}

export default UI