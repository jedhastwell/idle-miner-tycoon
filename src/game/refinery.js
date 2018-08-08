import {Sprite, Container} from 'pixi.js';

class Refinery extends Container {

  constructor () {
    super();

    const building = Sprite.fromImage('booth-window.png');
    building.position.set(0, -building.height);
    this.addChild(building);

    const roof = Sprite.fromImage('booth-top.png');
    roof.position.set(0, building.y - roof.height);
    this.addChild(roof);

    const pipe = Sprite.fromImage('refinery-out-1.png');
    pipe.position.set(roof.width, roof.y + roof.height * 0.4);
    this.addChild(pipe);
  }

}

export default Refinery
