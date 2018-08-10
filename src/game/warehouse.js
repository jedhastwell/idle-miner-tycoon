import {Sprite, Container} from 'pixi.js';
import Core  from '../core.js';
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

    this.addWorker();

    Core.engine.wait(2).then(this.collect.bind(this));

    this.on('collected', this.collect, this);
  }

  addWorker () {
    const worker = this._worker = Anims.make(Anims.transporter);
    worker.anchor.set(0.7, 0.93);
    worker.position.set(-200, 0);
    this.addChild(worker);

    const load = worker.load = Sprite.fromImage('cart-load-1.png');
    load.x = 3 - (worker.width * worker.anchor.x);
    load.y = 29 - (worker.height * worker.anchor.y);
    load.visible = false;
    worker.addChild(load);



    const tl = worker.timeline = new TimelineLite({paused: true});
    // Walk to refinery.
    tl.call(worker.play, [], worker);
    tl.to(worker, values.transportTime, {x: -420, ease: Linear.easeNone});
    // Collect load.
    tl.call(this.emit, ['collecting'], this);
    tl.call(worker.stop, [], worker);
    tl.set(worker.load, {visible: true}, '+=' + values.transportPause / 2);
    // Turn around and walk back to warehouse.
    tl.set(worker.scale, {x: -1}, '+=' + values.transportPause / 2);
    tl.call(worker.play, [], worker);
    tl.to(worker, values.transportTime, {x: -200, ease: Linear.easeNone});
    // Drop off load.
    tl.call(worker.stop, [], worker);
    tl.set(worker.load, {visible: false}, '+=' + values.transportPause / 2);
    tl.set(worker.scale, {x: 1}, '+=' + values.transportPause / 2);
    tl.call(this.emit, ['collected'], this);
  }

  addManager () {

  }

  collect () {

    this._worker.timeline.play(0);


  }

}

export default Warehouse
