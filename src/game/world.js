import * as Pixi from 'pixi.js';
import {Sprite, Texture, Container} from 'pixi.js';
import Refinery  from './refinery.js';
import Warehouse from './warehouse.js';
import Elevator  from './elevator.js';
import Clouds    from './clouds.js';
import Mineshaft from './mineshaft.js';
import effects   from './effects.js';
import TweenLite from 'TweenLite';
import TextButton from '../ui/textButton.js';
import core from '../core.js';
import values from './values.js';
import Building from './building.js';

const defaults = {
  groundPos: 600,
  warehousePos: 605
}


class World extends Container {

  constructor (bounds) {

    super();

    this._mineShafts = [];
    this._managerCount = 0;

    this.area = new Pixi.Rectangle(0,0, values.worldSpan, 1);
    this.bounds = bounds || { width: 750, height: 1334 };

    this.populate();

    this.linkComponentEvents();

    // Force layouts.
    this.emit('resize');

  }

  reset () {
    for (const shaft of this._mineShafts) {
      shaft.destroy();
    }
    this._mineShafts = [];
    this._managerCount = 0;
    this._elevator.reset();
    this._refinery.reset();
    this._warehouse.reset();
    this.addStartingManagers();
  }

  get bounds () {
    return this._viewBounds;
  }

  set bounds (value) {
    this._viewBounds = value;
    this.area.x = (this._viewBounds.width - values.worldSpan) / 2;
    this.area.height = this._viewBounds.height;
    this.emit('resize');
  }

  get mineShafts () {
    return this._mineShafts;
  }

  get levelCount () {
    return this._mineShafts.length;
  }

  get managerCount () {
    return this._managerCount;
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
    
    this.addStartingManagers();
    
  }

  addStartingManagers () {
    if (values.elevatorManager) {
      this._elevator.addManager();
      this._refinery.addManager();
      this._managerCount++;
    }

    if (values.warehouseManager) {
      this._warehouse.addManager();
      this._managerCount++;
    }
  }

  linkComponentEvents () {
    this._warehouse.on('collecting', this._refinery.unload, this._refinery);
    this._refinery.on('unloading', this._warehouse.collect, this._warehouse);
    this._elevator.on('unloading', (amount) => {
      this._refinery.collect(amount);
      this._warehouseIdleCheck();
    });
    this._warehouse.on('unloading', (amount) => {
      core.game.score += amount;
      core.game.cash += amount * values.cashPerAmount;
    });
    this._warehouse.on('idle', this._warehouseIdleCheck, this);
  }

  _warehouseIdleCheck () {
    if (this._refinery.amount > 0) {
      this._warehouse.promptWork();
    }
  }

  _elevatorIdleCheck () {
    for(const shaft of this.mineShafts) {
      if (shaft.amount > 0) {
        this._elevator.promptWork();
      }
    }
  }

  newLevel () {
    if (this.levelCount < values.maxMineshafts) {
      this.addMineshaft(this.levelCount + 1);
      this.emit('newLevel', this.levelCount);
    }
  }

  levelVacancies () {
    return this.levelCount < values.maxMineshafts;
  }

  newManager () {

    const addForShaft = (index) => {
      if (this._mineShafts[index] && !this._mineShafts[index].hasManager) {
        this._mineShafts[index].addManager();
        this._managerCount++;
        this._mineShafts[index].promptWork();
        return true;
      }
    }

    if (addForShaft(0)) {
      return;
    }
   
    if (!this._elevator.hasManager) {
      this._elevator.addManager();
      this._refinery.addManager();
      this._elevatorIdleCheck();
      this._managerCount++;
      return;
    }

    if (addForShaft(1)) {
      return;
    }

    if (!this._warehouse.hasManager) {
      this._warehouse.addManager();
      this._managerCount++;
      return;
    }

    for (let i = 2; i < this._mineShafts.length; i++) {
      if (addForShaft(i)) {
        return;
      }
    }

  }

  managerVacancies () {
    const vacancy = this._mineShafts.reduce((accumulator, shaft) => {
      return accumulator || !shaft.hasManager;
    }, false);
    
    return vacancy || !this._warehouse.hasManager || !this._elevator.hasManager;
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
    });
    elevator.disabled = this.mineShafts.length == 0;

    elevator.on('idle', this._elevatorIdleCheck, this);

    return elevator;
  }

  addMineshaft (level, instant) {
    const shaft = new Mineshaft(Mineshaft.typeForLevel(level), level);
    this.addChild(shaft);
    this.mineShafts.push(shaft);

    const layout = () => {
      shaft.position.set(
        this._elevator.x + this._elevator.width -1,
        this._elevator.y + Elevator.topForLevel(level)
      );
      shaft.span = this.bounds.width - shaft.x;
    };
    layout();

    const elevatorCollect = (onLevel) => {
      if (level == onLevel) {
        shaft.unload();
      }
    };

    if (values['mineshaft' + level + 'Manager']) {
      shaft.addManager(true);
    }

    this._elevator.levels = level;
    this._elevator.disabled = false;
    this._elevator.on(Building.Events.Collecting, elevatorCollect, this); 

    this.on('resize', layout);
    shaft.on(Building.Events.Unloading, this._elevator.collect, this._elevator);
    shaft.on(Building.Events.AmountChanged, this._elevatorIdleCheck, this);
    shaft.on(Building.Events.Idle, shaft.promptWork, shaft);

    shaft.on('destroy', () => {
      this._elevator.off(Building.Events.Collecting, elevatorCollect, this);
      this.off('resize', layout);
    })

    shaft.promptWork();

    if (!instant) {
      TweenLite.fromTo(shaft, 0.4, {alpha: 0}, {alpha: 1});
      effects.explosion(this, shaft.x + shaft.width / 2, shaft.y + shaft.height / 2);
    }

  }

}

export default World
