import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Anims from './animations.js';
import TimelineLite from 'TimelineLite';
import values from './values';

const defaults = {
  tunnelLength: 2,

  minerIdleX: 170,
  minerWorkX: 320,

  crateX: 20
}

class MineShaft extends Container {

  constructor (type) {
    super();
    this._type = type;
    this._span = 100;
    this.populate();
  }

  get span () {
    return this._span;
  }

  set span (value) {
    this._span = value;
    this.emit('resize');
  }

  populate () {
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

    this.addWorker();
    this.addCrate();
  }

  addWorker () {
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
    tl.set(worker, {working: false});

    worker.interactive = true;
    worker.on('pointertap', ()=>{
      if (!worker.working) {
        worker.timeline.play(0);
      }
    });

  }

  addCrate () {
    const crate = Sprite.fromImage('crate.png');
    crate.anchor.set(0, 1);
    crate.position.set(defaults.crateX, this.height - 15);
    this.addChild(crate);

    /*const load = crate.load = Sprite.fromImage(this._type.loadImage);
    load.anchor.set(0, 1);
    load.x = 10 - (crate.width * crate.anchor.x);
    load.y = - (crate.height * crate.anchor.y);
    load.visible = true;
    crate.addChild(load);*/

    const tl = crate.timeline = new TimelineLite({paused: true});
    tl.to(crate, values.crateUnloadTime, {rotation: -Math.PI / 3});
    tl.to(crate, values.crateUnloadTime, {rotation: 0});

    this.on('unloading', crate.timeline.play, crate.timeline);
  }

  unload () {
    this.emit('unloading');
  }

}

MineShaft.Types = {
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

MineShaft.typeForLevel = (level) => {
  const levels = [
    MineShaft.Types.Gold,
    MineShaft.Types.Amethyst,
    MineShaft.Types.Jade
  ];
  return levels[level - 1];
}

export default MineShaft
