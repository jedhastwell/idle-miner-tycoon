import Building from './building';
import {Sprite, Container} from 'pixi.js';
import Anims from './animations.js';
import TimelineLite from 'TimelineLite';
import values from './values';
import Pointer from './pointer.js';
import CashLabel from '../ui/cashLabel';

const defaults = {
  workerIdleX: -200,
  workerCollectXOffset: 275
}

class Warehouse extends Building {

  constructor () {
    super();

    this._collectX = - (values.worldSpan - defaults.workerCollectXOffset);

    const building = Sprite.fromImage('booth-door.png');
    building.position.set(-building.width, -building.height);
    this.addChild(building);

    const roof = Sprite.fromImage('booth-top.png');
    roof.position.set(building.x, building.y - roof.height);
    this.addChild(roof);

    this._addWorker();

    this.on(Building.Events.Unloading, (amount) => {
      if (amount > 0) {
        const label = new CashLabel(values.getCash(amount), true);
        this.addChild(label);
  
        const tl = new TimelineLite();
        tl.set(label, {x: -230, y: -120, alpha: 1});
        tl.to(label, 2, {y: -200, alpha: 0});
        tl.play();
      }
    });
  }

  reset () {
    this._worker.position.set(defaults.workerIdleX, 0);
    if (this._worker.scale.x == -1) {
      this._worker.flip();
    }
    this._worker.load.visible = false;
    if (this._worker.tl) {
      this._worker.tl.kill();
      this._worker.tl = null;
    }
    this._worker.stop();
    super.reset();
  }

  _addManager () {
    const manager = Anims.make(Anims.managerSrWorking);
    manager.anchor.set(0.5, 1);
    manager.position.set(-85, 0);
    manager.scale.x = -1;
    manager.play();
    this.addChild(manager);
    return manager;
  }

  _addPointer () {
    return Pointer.pool.make(this, this._worker.x - this._worker.width * 0.25, this._worker.y - this._worker.height, 2, ()=>{this.click()});
  }


  _work () {
    const worker = this._worker;

    const tl = worker.tl = new TimelineLite();
    // Walk to refinery.
    tl.call(worker.play, [], worker);
    tl.to(worker, values.warehouseWalkTime, {x: this._collectX, ease: Linear.easeNone});
    // Collect load.
    tl.call(worker.stop, [], worker);
    tl.call(this.emit, [Building.Events.Collecting], this);    
  }

  collect (amount) {

    super.collect(amount);

    const wait = values.getRefinaryUnloadTime(amount) / 2;
    const worker = this._worker;

    const tl = worker.tl = new TimelineLite();
    tl.set(worker.load, {visible: (amount > 0)}, '+=' + wait);
    // Turn around and walk back to warehouse.
    tl.call(worker.flip, [], worker, '+=' + wait);
    tl.call(worker.play, [], worker);
    tl.to(worker, values.warehouseWalkTime, {x: defaults.workerIdleX, ease: Linear.easeNone});
    // Drop off load.
    tl.call(worker.stop, [], worker);
    tl.set(worker.load, {visible: false}, '+=' + wait);
    tl.call(this.unload, [], this);
    tl.call(worker.flip, [], worker, '+=' + wait);
    tl.call(this.idle, [], this);
  }

  _addWorker () {
    const worker = this._worker = Anims.make(Anims.transporter);
    worker.anchor.set(0.7, 0.93);
    worker.position.set(defaults.workerIdleX, 0);
    this.addChild(worker);

    const load = worker.load = Sprite.fromImage('cart-load-1.png');
    load.x = 3 - (worker.width * worker.anchor.x);
    load.y = 29 - (worker.height * worker.anchor.y);
    load.visible = false;
    worker.addChild(load);

    worker.interactive = true;
    worker.on('pointertap', this.click, this);

    const label = this.addAmountLabel(worker, -35, -35, true);

    worker.flip = () => {
      worker.scale.x *= -1;
      label.scale.x = Math.abs(label.scale.x) * worker.scale.x;
      label.x = worker.scale.x == -1 ? -30 : -35;
    }

  }

}

export default Warehouse
