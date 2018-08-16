import * as Pixi      from 'pixi.js';
import {Container}    from 'pixi.js';
import core           from '../core.js';
import util           from '../util/util.js';
import World          from './world.js';
import UI from '../ui/ui.js';
import Elevator from './elevator.js';
import values from './values.js';

const defaults = {};


class Game extends Container {

  constructor (options = {}) {
    super();

    core.game = this;

    this.options = util.merge(defaults, options);

    this.populate();

    core.engine.on('resize', this.layout, this);

    this.restart();

  }

  restart() {
    this.score = 0;
    this.cash = 0;
    this.state = Game.State.Tutorial;
  }

  populate () {

    core.engine.on('tick',this.update, this);
    

    this._world = new World();
    this.addChild(this._world);

    this._ui = new UI(this._world);
    this.addChild(this._ui);

    this.layout();


    this._world.on('newLevel', (level) => {
      this.layout();
    })

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


    const size = util.limitToRatio({width: 700, height: 1400}, 9/16, 9/16, 9/16, 9/16);
    const scale = size.width / screen.width;

    const bottom = (Elevator.bottomForLevel(this._world._levels) + 605) * scale;
    const offset = Math.max(0, 200 - (screen.height - bottom));


    const bounds = {
      width: screen.width / scale,
      height: (screen.height + offset) / scale
    };

    this._world.bounds = bounds;
    this._world.scale.set(scale);
    this._world.y = -offset;

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
