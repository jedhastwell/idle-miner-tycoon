import {Sprite, Container} from 'pixi.js';

class Depot extends Container {

  constructor () {
    super();

    const building = Sprite.fromImage('booth-door.png');
    building.position.set(-building.width, -building.height);
    this.addChild(building);

    const roof = Sprite.fromImage('booth-top.png');
    roof.position.set(building.x, building.y - roof.height);
    this.addChild(roof);
  }

}

export default Depot
