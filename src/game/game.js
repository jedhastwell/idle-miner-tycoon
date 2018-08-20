import * as Pixi      from 'pixi.js';
import {Container}    from 'pixi.js';
import core           from '../core.js';
import util           from '../util/util.js';
import World          from './world.js';
import UI from '../ui/ui.js';
import Elevator from './elevator.js';
import values from './values.js';
import { TweenLite } from 'gsap';
import Pointer from './pointer.js';

const defaults = {};


class Game extends Container {

  constructor (options = {}) {
    super();

    core.game = this;

    const valuesOverride = {};

    if ('gameOverText' in options) {
      valuesOverride.gameOverText = options.gameOverText
    }

    if ('introText' in options) {
      valuesOverride.introText = options.introText
    }

    values.set(values.presets.fast);
    values.set(valuesOverride);
    
    
    this.options = util.merge(defaults, options);

    this.score = 0;
    this.cash = 0;

    this.populate();

    core.engine.on('resize', () => {this.layout()}, this);

    this.state = null;

  }

  start () {
    this.state = Game.State.Intro;
  }

  restart() {
    this.score = 0;
    this.cash = 0;

    this._world.reset();
    this._ui.reset();
    this.layout();

    this.state = Game.State.Intro;
  }

  populate () {

    this._world = new World();
    this.addChild(this._world);

    this._ui = new UI(this._world);
    this.addChild(this._ui);

    this.layout();

    this._world.on('newLevel', () => {this.layout(true)}, this);

    core.engine.on('tick', this.update, this);
  }

  get score () {
    return this._score;
  }

  set score (value) {
    this._score = value;
    this.emit('scoreChanged', this._score);
  }

  get cash () {
    return this._cash;
  }

  set cash (value) {
    this._cash = value;
    this.emit('cashChanged', this._cash);
  }

  get state () {
    return this._state;
  }

  set state (value) {
    this._state = value;

    if (value == Game.State.Intro) {
      // Intro starting
      PlayableKit.analytics.intro();
      this._ui.introSequence().then(() => {
        this.state = Game.State.Playing;
      });
    }

    if (value == Game.State.Tutorial) {
      // Tutorial starting.
      PlayableKit.analytics.tutorial();
    }

    if (value == Game.State.Playing) {
      // Game starting.
      PlayableKit.analytics.game();
    }

    if (value == Game.State.Outro) {
      // Outro starting.
      PlayableKit.analytics.outro();
      this._ui.levelCompleteSequence().then(() => {
        this.state = Game.State.Over;
      });
    }

    if (value == Game.State.Over) {
      PlayableKit.analytics.gameOver(true, this.score);
      this.emit('complete');
    }

  }

  allowInteraction () {
    return this.state == Game.State.Playing;
  }

  update (elapsed) {

    Pointer.pool.update(elapsed);

    if (this.state == Game.State.Playing) {
      
      if (this.cash >= values.targetCash) {
        this.state = Game.State.Outro;
      }
    }
    
  }

  layout (animate) {
    let screen = core.engine.screen;

    // Force portrait view.
    if (this.options.rotateWhenLandscape && screen.width > screen.height) {
      screen = {width: screen.height, height: screen.width};
      this.rotation = -Math.PI / 2;
      this.position.set(0, screen.width);
    } else {
      this.rotation = 0;
      this.position.set(0,0);
    }

    // Create a static rectangle that should fit most of what we want to see.
    const world = {width: values.worldSpan, height: values.worldSpan * 1.9};

    // Resize that rectangle so it fits into the screen.
    const size = util.resizeToFit(world, {
      width: Math.min(screen.width, screen.height), 
      height: Math.max(screen.width, screen.height)
    });
    const scale = size.width / screen.width;

    const bottom = 605 + Elevator.bottomForLevel(this._world.levelCount) + (170 / scale);

    let offset = 0;
    if (bottom * scale > screen.height) {
      offset = (bottom * scale) - (screen.height);
    }

    const bounds = {
      width: screen.width / scale,
      height: (screen.height / scale) + offset / scale
    };

    this._world.bounds = bounds;
    this._world.scale.set(scale);

    if (animate) {
      TweenLite.to(this._world, 0.3, {y: -offset});
    } else {
      this._world.y = -offset;
    }

  }

}

Game.State = {
  Intro: 0,
  Tutorial: 1,
  Playing: 2,
  Outro: 3,
  Over: 4
}


export default Game
