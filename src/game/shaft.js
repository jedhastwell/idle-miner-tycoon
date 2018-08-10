import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';

const defaults = {
  tunnelLength: 2
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
