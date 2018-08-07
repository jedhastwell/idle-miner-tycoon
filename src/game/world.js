import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';

const defaults = {
  groundPos: 700,
  depotPos: 705,
  span: 700
}


class World extends Container {

  constructor (bounds) {

    super();

    // bounds, dimensions, size, boundary, border, rect, field, limits, area
    this.area = new Pixi.Rectangle(0,0, defaults.span, 1);
    this.bounds = bounds || { width: 750, height: 1334 };

    this.populate();

    // Force layouts.
    this.emit('resize');

  }

  get bounds() {
    return this._viewBounds;
  }

  set bounds(value) {
    this._viewBounds = value;
    this.area.x = (this._viewBounds.width - defaults.span) / 2;
    this.area.height = this._viewBounds.height;
    console.log(this.area.right);
    this.emit('resize');
  }

  populate () {
    this.addBackground();
    this.addMountains();
    this.addGround();

    this.addDepot();
    this.addSurface();

    this.addRefinery();

  }

  addBackground () {
    const skyTexture = Texture.fromImage('sky.png');
    const sky = new Pixi.extras.TilingSprite(skyTexture);

    this.addChild(sky);

    this.on('resize', () => {
      sky.width = this.bounds.width;
      sky.height = defaults.groundPos;
      sky.tileScale.y = defaults.groundPos / skyTexture.height;
    });

  }

  addMountains () {
    const mountains = Sprite.fromImage('bg-mountains.png');
    mountains.anchor.set(0.5, 1);

    this.addChild(mountains);

    this.on('resize', () => {
      mountains.width = this.area.width * 0.7;
      mountains.scale.y = mountains.scale.x;

      mountains.y = defaults.groundPos;
      mountains.x = this.area.x + this.area.width / 2;
    });
  }

  addSurface () {
    const surfaceTexture = Texture.fromImage('surface-tile.png');
    const surface = new Pixi.extras.TilingSprite(surfaceTexture);
    surface.tilePosition.y = -1;

    this.addChild(surface);

    this.on('resize', () => {
      surface.height = surfaceTexture.height - 1;
      surface.width = this.bounds.width;
      surface.y = defaults.groundPos - surface.height * 0.25;
    });

  }

  addGround () {
    const groundTexture = Texture.fromImage('earth-tile.png');
    const ground = new Pixi.extras.TilingSprite(groundTexture);

    this.addChild(ground);

    this.on('resize', () => {
      ground.width = this.bounds.width;
      ground.height = this.bounds.height - defaults.groundPos;
      ground.y = defaults.groundPos;
    });

  }

  addDepot () {
    const depot = Sprite.fromImage('booth-door.png');
    this.addChild(depot);

    this.on('resize', () => {
      depot.anchor.set(1, 1);
      depot.position.set(this.area.right, defaults.depotPos);
    });

  }

  addRefinery () {
    const refinery = Sprite.fromImage('booth-window.png');
    this.addChild(refinery);

    this.on('resize', () => {
      refinery.anchor.set(0, 1);
      refinery.position.set(this.area.left, defaults.depotPos);
    })

  }

}

export default World
