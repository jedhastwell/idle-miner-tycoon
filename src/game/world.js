import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Refinery  from './refinery.js';
import Warehouse from './warehouse.js';
import Elevator  from './elevator.js';
import Clouds    from './clouds.js';
import MineShaft from './shaft.js';

const defaults = {
  groundPos: 600,
  warehousePos: 605,
  span: 700
}


class World extends Container {

  constructor (bounds) {

    super();

    // bounds, dimensions, size, boundary, border, rect, field, limits, area
    this.area = new Pixi.Rectangle(0,0, defaults.span, 1);
    this.bounds = bounds || { width: 750, height: 1334 };

    this.populate();
    this.linkComponentEvents();

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
    this.addSurface();
    this._warehouse = this.addWarehouse();
    this._refinery  = this.addRefinery();
    this._elevator  = this.addElevator();
    this.addMineShaft(1);
    this.addMineShaft(2);
  }

  linkComponentEvents () {
    this._warehouse.on('collecting', this._refinery.unload, this._refinery);
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

  addWarehouse () {
    const warehouse = new Warehouse();
    this.addChild(warehouse);

    this.on('resize', () => {
      warehouse.position.set(this.area.right, defaults.warehousePos);
    });

    return warehouse;
  }

  addRefinery () {
    const refinery = new Refinery();
    this.addChild(refinery);

    this.on('resize', () => {
      refinery.position.set(this.area.left, defaults.warehousePos);
    });

    return refinery;
  }

  addElevator () {
    const elevator = new Elevator(defaults.levelHeight);
    this.addChild(elevator);
    this.on('resize', () => {
      elevator.position.set(this.area.left, defaults.warehousePos);
    })

    return elevator;
  }

  addMineShaft (level) {
    const shaft = new MineShaft(MineShaft.typeForLevel(level));
    this.addChildAt(shaft, this.getChildIndex(this._elevator));
    this.on('resize', () => {
      shaft.position.set(
        this._elevator.x + this._elevator.width -1,
        this._elevator.y + Elevator.topForLevel(level)
      );
      shaft.span = this.bounds.width - shaft.x;
    });

    this._elevator.levels = level;
  }

}

export default World
