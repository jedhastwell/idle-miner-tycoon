import { Container, Text, Sprite, Graphics } from "pixi.js";
import TextButton from "./textButton";
import CashButton from "./cashButton";
import core from "../core";
import Pointer from "../game/pointer";
import TotalCashLabel from "./totalCashLabel";
import values from "../game/values";
import effects from "../game/effects";
import TimelineLite from 'TimelineLite';
import TweenLite from 'TweenLite';
import pixiUtil from '../util/pixiUtil';


class UI extends Container {

  constructor (world) {
    super();
    
    this._world = world;

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

    // this._totalCashLabel.flash(3);
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

      this.showDimmer(true);
      const show = new TimelineLite();
      show.to(char, 0.2, {x: -30, ease: Quad.easeIn}, '+=0.5');
      show.set(bubble, {alpha: 1}, '+=0.25');
      show.to(bubble.scale, 0.2, {x: 1, y: 1, ease: Quad.easeInOut});
    
      const layout = () => {
        container.position.set(0, core.engine.screen.height);
      }
      layout();
      core.engine.on('resize', layout, this);

      this._world.once('newLevel', () => {
        show.kill();
        core.engine.off('resize', layout, this);
        this._dimmer.interactive = false;

        const hide = new TimelineLite();
        hide.call(resolve, [], this);
        hide.to(bubble, 0.15, {alpha: 0});
        hide.to(char, 0.2, {x: -char.width - 10, ease: Quad.easeOut}, '-=0.1');
        hide.call(this.hideDimmer, [], this, '-=0.15');
        hide.call(container.destroy, [{children: true}], container, '+=0.5');
      }, this);

      this._dimmer.interactive = true;
      this._dimmer.once('pointertap', () => {
        this._shaftBtn.emit('pressed', this._shaftBtn, false);
      }, this);

    });
  }

  _populate () {
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
    const shaftBtn = this._shaftBtn = new CashButton ('New Shaft' , values.getMineshaftCost(1));

    shaftBtn.shouldDisable = () => {
      return !this._world.levelVacancies();
    }

    shaftBtn.on('pressed', (btn, automated) => {
      if (!automated) {
        PlayableKit.analytics.gameInteracted();
      }
      this._world.newLevel();
    }, this._world);

    this._world.on('newLevel', () => {
      managerBtn._check();
      shaftBtn.cost = values.getMineshaftCost(this._world.levelCount + 1);
    })

    this.addChild(shaftBtn);
    

    const managerBtn = this._managerBtn = new CashButton ('Manager', values.getManagerCost(1));

    managerBtn.on('pressed', (btn, automated) => {
      if (!automated) {
        PlayableKit.analytics.gameInteracted();
      }
      
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

    this._dimmer.width = core.engine.screen.width;
    this._dimmer.height = core.engine.screen.height;
  }

}

export default UI