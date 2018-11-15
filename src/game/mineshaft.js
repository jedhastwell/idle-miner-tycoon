import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Building from './building';
import Anims from './animations.js';
import TimelineLite from 'TimelineLite';
import values from './values';
import Pointer from './pointer.js';
import util from '../util/util';

const defaults = {
  tunnelLength: 2,
  minerIdleX: 250,
  minerWorkX: 320,
  managerX: 130,
  crateX: 20
}

class Mineshaft extends Building {

  constructor (type, level) {
    super();
    this._level = level;
    this._type = type;
    this._span = 100;
    this._populate();
  }

  get span () {
    return this._span;
  }

  set span (value) {
    this._span = value;
    this.emit('resize');
  }

  destroy () {
    this._worker.timeline.kill();
    if (this._crate.timeline) {
      this._crate.timeline.kill();
    }
    this.emit('destroy');
    super.destroy({children: true});
  }

  _work () {
    this._worker.timeline.play(0);
  }

  unload () {
    if (this.amount > 0) {
      const duration = values.getMineUnloadTime(this.amount);

      const tl = this._crate.timeline = new TimelineLite();
      tl.to(this._crate, duration / 2, {rotation: -Math.PI / 3});
      tl.call(() => {
        this.emit(Building.Events.Unloading, this.amount, this._level);
        this.amount = 0;
      }, [], this);
      tl.to(this._crate, duration / 2, {rotation: 0});

    } else {
      this.emit(Building.Events.Unloading, 0, this._level);
    }
  }

  _addManager () {
    const manager = Anims.make(Anims.managerJrWorking);
    manager.anchor.set(0.5, 1);
    manager.position.set(defaults.managerX, Texture.fromImage(this._type.tunnelImage).height - 14);
    manager.play();
    this.addChildAt(manager, this.getChildIndex(this._worker));
    return manager;
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

    const cb = this._crate.getBounds();
    this.addAmountLabel(this, cb.left + cb.width / 2, cb.top - 50);
  }

  _addPointer () {
    return Pointer.pool.make(this, 
      this._worker.x - this._worker.width * 0.25,
      this._worker.y - this._worker.height,
    0, this.click.bind(this), values.tooltipMineshaft);
  }

  _addWorker () {
    const worker = this._worker = Anims.make(Anims.minerIdle, true);
    worker.anchor.set(0.5, 1);
    worker.position.set(defaults.minerIdleX, this.height);
    this.addChild(worker);

    const tl = worker.timeline = new TimelineLite({paused: true});
    tl.call(Anims.set, [worker, Anims.minerWalk, true], this);
    tl.to(worker, values.minerWalkTime, {x: defaults.minerWorkX, ease: Linear.easeNone});

    tl.call(Anims.set, [worker, Anims.minerWork, true], this);

    tl.call(Anims.set, [worker, Anims.minerCarry, true], this, '+=' + values.minerWorkTime);
    tl.to(worker, values.minerWorkTime, {x: defaults.minerIdleX, ease: Linear.easeNone});

    tl.call(Anims.set, [worker, Anims.minerIdle, true], this);
    tl.call(this.collect, [values.getAmountForLevel(this._level)], this);
    tl.call(this.idle, [], this, '+=' + values.minerRestTime);
    
    worker.interactive = true;
    worker.on('pointertap', this.click, this);
  }

  _addCrate () {
    const crate = this._crate = Sprite.fromImage('crate.png');
    crate.anchor.set(0, 1);
    crate.position.set(defaults.crateX, this.height - 15);
    this.addChild(crate);
  }

}

Mineshaft.Types = {
  Gold: {
    tunnelImage: 'shaft-tunnel-1.png',
    wallImage: 'shaft-gold-wall-1.png',
    earthImage: 'shaft-gold-earth.png'
  },
  Amethyst: {
    tunnelImage: 'shaft-tunnel-1.png',
    wallImage: 'shaft-amethyst-wall-1.png',
    earthImage: 'shaft-amethyst-earth.png'
  },
  Jade: {
    tunnelImage: 'shaft-tunnel-2.png',
    wallImage: 'shaft-jade-wall-2.png',
    earthImage: 'shaft-jade-earth.png'
  }
}

Mineshaft.typeForLevel = (level) => {
  const levels = [
    Mineshaft.Types.Gold,
    Mineshaft.Types.Amethyst,
    Mineshaft.Types.Jade
  ];
  return levels[util.limitNum(level - 1, 0, levels.length - 1)];
}

export default Mineshaft
