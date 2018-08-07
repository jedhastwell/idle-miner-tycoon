import * as Pixi      from 'pixi.js';
import {Container}    from 'pixi.js';
import Core           from '../core.js';
import util           from '../util/util.js';
import World          from './world.js';

const defaults = {};


class Game extends Container {

  constructor (options = {}) {
    super();

    this.options = util.merge(defaults, options);

    this.populate();

    Core.engine.on('resize', this.layout, this);

    this._score = 0;
    this._state = null;

    this.restart();
  }

  restart() {
    this.score = 0;
    this.state = Game.State.Tutorial;
  }

  populate () {

    Core.engine.on('tick',this.update, this);

    this._world = new World();
    this.addChild(this._world);

    this.layout();

  }

  get score () {
    return this._score;
  }

  set score (value) {
    this._score = value;
    this.emit('scoreChanged', this._score);
  }

  get state () {
    return this._state;
  }

  set state (value) {
    this._state = value;

    if (value == Game.State.Intro) {
      // Intro starting
      PlayableKit.analytics.intro();
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
    }

    if (value == Game.State.Over) {
      this.emit('complete');
    }

  }

  update (elapsed) {


  }

  layout () {
    let screen = Core.engine.screen;

    // Force portrait view.
    if (screen.width > screen.height) {
      screen = {width: screen.height, height: screen.width};
      this._world.rotation = -Math.PI / 2;
      this._world.position.set(0, screen.width);
    } else {
      this._world.rotation = 0;
      this._world.position.set(0,0);
    }

    const size = util.limitToRatio(screen, 9/16, 9/16, 9/16, 9/16);
    const scale = size.width / screen.width;
    const bounds = {width: screen.width / scale, height: screen.height / scale};
    
    this._world.bounds = bounds;
    this._world.scale.set(scale);

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
