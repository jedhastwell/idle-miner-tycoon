import {Sprite, Container} from 'pixi.js';
import Anims from './animations.js';
import TimelineLite from 'TimelineLite';
import values from './values';


class Warehouse extends Container {

  constructor () {
    super();

    const building = Sprite.fromImage('booth-door.png');
    building.position.set(-building.width, -building.height);
    this.addChild(building);

    const roof = Sprite.fromImage('booth-top.png');
    roof.position.set(building.x, building.y - roof.height);
    this.addChild(roof);

    this._addWorker();
  }

  _addWorker () {
    const worker = this._worker = Anims.make(Anims.transporter);
    worker.anchor.set(0.7, 0.93);
    worker.position.set(-200, 0);
    this.addChild(worker);

    const load = worker.load = Sprite.fromImage('cart-load-1.png');
    load.x = 3 - (worker.width * worker.anchor.x);
    load.y = 29 - (worker.height * worker.anchor.y);
    load.visible = false;
    worker.addChild(load);

    worker.interactive = true;
    worker.on('pointertap', this.work, this);

    this._amount = 0;

  }

  _addManager () {

  }

  get amount () {
    return this._amount;
  }

  work () {
    if (!this.working) {

      const worker = this._worker;

      const tl = new TimelineLite();
      tl.set(this, {working: true});
      // Walk to refinery.
      tl.call(worker.play, [], worker);
      tl.to(worker, values.transportTime, {x: -420, ease: Linear.easeNone});
      // Collect load.
      tl.call(this.emit, ['collecting'], this);
      tl.call(worker.stop, [], worker);
      tl.call(tl.kill, [], tl);
    }

  }

  collect (amount) {

    this._amount = amount;

    const wait = values.getRefinaryUnloadTime(amount);
    const worker = this._worker;

    const tl = new TimelineLite();
    tl.set(worker.load, {visible: (amount > 0)}, '+=' + wait / 2);
    // Turn around and walk back to warehouse.
    tl.set(worker.scale, {x: -1}, '+=' + wait / 2);
    tl.call(worker.play, [], worker);
    tl.to(worker, values.transportTime, {x: -200, ease: Linear.easeNone});
    // Drop off load.
    tl.call(worker.stop, [], worker);
    tl.set(worker.load, {visible: false}, '+=' + values.transportPause / 2);
    tl.set(worker.scale, {x: 1}, '+=' + values.transportPause / 2);
    tl.set(this, {working: false});
    tl.call(this.emit, ['collected'], this);

  }

}

export default Warehouse
