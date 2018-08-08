import {Sprite, Container} from 'pixi.js';
import Core from '../core.js';

const defaults = {
  quantity: 5,
  speed: 90,
  speedRange: 45,
  rightToLeft: true,
  buffer: 25,
  images: ['cloud-1.png', 'cloud-2.png']
}

class Clouds extends Container {

  constructor () {
    super();

    this._viewBounds = { width: 600, height: 300 };
    this._clouds = [];

    this._populate();

    Core.engine.on('tick', this._update, this);
  }

  _populate () {
    for (let i = 0; i < defaults.quantity; i++) {
      const image = defaults.images[Math.floor(Math.random() * defaults.images.length)];
      const cloud = Sprite.fromImage(image);
      cloud.speed = defaults.speed + Math.floor(Math.random() * defaults.speedRange) - (defaults.speedRange / 2);
      this._respawn(cloud, i);
      this._clouds.push(cloud);
      this.addChild(cloud);
    }
  }

  _respawn (cloud, zone) {
    cloud.y = Math.floor(Math.random() * (this.bounds.height - cloud.height));
    if (zone !== undefined) {
      const span = (this.bounds.width / defaults.quantity);
      cloud.x = span * zone + Math.floor(Math.random() * span);
    } else {
      if (defaults.rightToLeft) {
        cloud.x = this.bounds.width + defaults.buffer;
      } else {
        cloud.x = -(could.width + defaults.buffer);
      }
    }
  }

  _update (elapsed) {
    for (const cloud of this._clouds) {
      cloud.x += cloud.speed * elapsed * (defaults.rightToLeft ? -1 : 1);

      if (defaults.rightToLeft) {
        if (cloud.x + cloud.width < -defaults.buffer) {
          this._respawn(cloud);
        }
      } else {
        if (cloud.x > this.bounds.width + defaults.buffer) {
          this._respawn(cloud);
        }
      }
    }
  }

  _resize (prev) {
    for (const cloud of this._clouds) {
      cloud.position.set(
        (cloud.x / prev.width) * this.bounds.width,
        (cloud.y / prev.height) * this.bounds.height
      )
    }
  }

  get bounds() {
    return this._viewBounds;
  }

  set bounds(value) {
    const prev = this._viewBounds;
    this._viewBounds = value;
    this._resize(prev);
  }

}

export default Clouds
