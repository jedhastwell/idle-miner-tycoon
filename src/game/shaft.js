import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Anims from './animations.js';
import TimelineLite from 'TimelineLite';
import values from './values';
import CashLabel from '../ui/cashLabel.js';

const defaults = {
  tunnelLength: 2,
  minerIdleX: 170,
  minerWorkX: 320,
  crateX: 20
}

class MineShaft extends Container {

  constructor (type, level) {
    super();
    this._level = level;
    this._type = type;
    this._span = 100;
    this._amount = 0;
    this._populate();
  }

  get span () {
    return this._span;
  }

  set span (value) {
    this._span = value;
    this.emit('resize');
  }

  get amount () {
    return this._amount;
  }

  set amount (value) {
    this._amount = value;
    this._amountLabel.value = values.getCash(value);
  }

  work () {
    if (!this._worker.working) {
      this._worker.timeline.play(0);
    }
  }

  unload () {
    this.emit('unloading', this.amount, this._level);
    if (this.amount > 0) {
      const duration = values.getMineUnloadTime(this.amount);

      const tl = new TimelineLite();
      tl.to(this._crate, duration / 2, {rotation: -Math.PI / 3});
      tl.set(this, {amount: 0});
      tl.to(this._crate, duration / 2, {rotation: 0});
    }
  }

  _populate () {
    const tunnelTexture = Texture.fromImage(this._type.tunnelImage);
    const tunnel = new Pixi.extras.TilingSprite(tunnelTexture);
    tunnel.height = tunnelTexture.height;
    tunnel.width = tunnelTexture.width * defaults.tunnelLength;
    this.addChild(tunnel);

    const wall = Sprite.fromImage(this._type.wallImage);
    wall.x = tunnel.width;
    this.addChild(wall);

    const earthTexture = Texture.fromImage(this._type.earthImage);
    const earth = new Pixi.extras.TilingSprite(earthTexture);
    earth.height = earthTexture.height;
    earth.x = wall.x + wall.width;
    earth.width = earthTexture.width;
    this.addChild(earth);

    this.on('resize', () => {
      earth.width = this.span - earth.x;
    });

    this._addWorker();
    this._addCrate();
    this._addUi();
  }

  _addWorker () {
    const worker = this._worker = Anims.make(Anims.minerIdle, true);
    worker.anchor.set(0.5, 1);
    worker.position.set(defaults.minerIdleX, this.height);
    this.addChild(worker);

    const tl = worker.timeline = new TimelineLite({paused: true});
    tl.set(worker, {working: true});
    tl.call(Anims.set, [worker, Anims.minerWalk, true], this);
    tl.to(worker, values.minerWalkTime, {x: defaults.minerWorkX, ease: Linear.easeNone});

    tl.call(Anims.set, [worker, Anims.minerWork, true], this);

    tl.call(Anims.set, [worker, Anims.minerCarry, true], this, '+=' + values.minerWorkTime);
    tl.to(worker, values.minerWorkTime, {x: defaults.minerIdleX, ease: Linear.easeNone});

    tl.call(Anims.set, [worker, Anims.minerIdle, true], this);
    tl.call(() => {
      this.amount += this._type.amount;
    }, [], this);
    tl.set(worker, {working: false});

    worker.interactive = true;
    worker.on('pointertap', this.work, this);
  }

  _addCrate () {
    const crate = this._crate = Sprite.fromImage('crate.png');
    crate.anchor.set(0, 1);
    crate.position.set(defaults.crateX, this.height - 15);
    this.addChild(crate);
  }

  _addUi () {
    this._amountLabel = new CashLabel();
    const cb = this._crate.getBounds();
    this._amountLabel.position.set(cb.left, cb.top - 50);
    this.addChild(this._amountLabel);
  }

}

MineShaft.Types = {
  Gold: {
    tunnelImage: 'shaft-tunnel-1.png',
    wallImage: 'shaft-gold-wall-1.png',
    earthImage: 'shaft-gold-earth.png',
    amount: 1
  },
  Amethyst: {
    tunnelImage: 'shaft-tunnel-1.png',
    wallImage: 'shaft-amethyst-wall-1.png',
    earthImage: 'shaft-amethyst-earth.png',
    amount: 1.5
  },
  Jade: {
    tunnelImage: 'shaft-tunnel-2.png',
    wallImage: 'shaft-jade-wall-2.png',
    earthImage: 'shaft-jade-earth.png',
    amount: 2
  }
}

MineShaft.typeForLevel = (level) => {
  const levels = [
    MineShaft.Types.Gold,
    MineShaft.Types.Amethyst,
    MineShaft.Types.Jade
  ];
  return levels[level - 1];
}

export default MineShaft
