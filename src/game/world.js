import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Refinery  from './refinery.js';
import Depot     from './depot.js';
import Elevator  from './elevator.js';
import Clouds    from './clouds.js';

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
    this.emit('resize');
  }

  populate () {
    this.addSky();
    this.addClouds();
    this.addMountains();
    this.addEarth();
    this.addDepot();
    this.addSurface();
    this.addRefinery();
    this.addElevator();
  }

  addSky () {
    const skyTexture = Texture.fromImage('sky.png');
    const sky = new Pixi.extras.TilingSprite(skyTexture);

    this.addChild(sky);

    this.on('resize', () => {
      sky.width = this.bounds.width;
      sky.height = defaults.groundPos;
      sky.tileScale.y = defaults.groundPos / skyTexture.height;
    });

  }

  addClouds () {
    const clouds = new Clouds();
    this.addChild(clouds);
    this.on('resize', () => {
      clouds.bounds = {
        width: this.bounds.width,
        height: defaults.groundPos * 0.7
      }
    });
  }

  addMountains () {
    const mountains = Sprite.fromImage('bg-mountains.png');
    mountains.anchor.set(0.5, 1);

    this.addChild(mountains);

    this.on('resize', () => {
      mountains.width = this.area.width * 0.9;
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

  addEarth () {
    const earthTexture = Texture.fromImage('earth-tile.png');
    const earth = new Pixi.extras.TilingSprite(earthTexture);

    this.addChild(earth);

    this.on('resize', () => {
      earth.width = this.bounds.width;
      earth.height = this.bounds.height - defaults.groundPos;
      earth.y = defaults.groundPos;
    });

  }

  addDepot () {
    const depot = new Depot();
    this.addChild(depot);

    this.on('resize', () => {
      depot.position.set(this.area.right, defaults.depotPos);
    });
  }

  addRefinery () {
    const refinery = new Refinery();
    this.addChild(refinery);

    this.on('resize', () => {
      refinery.position.set(this.area.left, defaults.depotPos);
    });
  }

  addElevator () {
    const elevator = new Elevator(defaults.levelHeight);
    this.addChild(elevator);
    this.on('resize', () => {
      elevator.position.set(this.area.left, defaults.depotPos);
    })
  }

}

export default World
