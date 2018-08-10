import * as Pixi from 'pixi.js';
import {Texture} from 'pixi.js';

const pipe = {
  loop: true,
  speed: 0.2,
  images: [
    'refinery-out-1.png',
    'refinery-out-2.png',
    'refinery-out-3.png',
    'refinery-out-4.png',
    'refinery-out-5.png',
    'refinery-out-6.png'
  ]
}

const transporter = {
  loop: true,
  speed: 0.15,
  images: [
    'carrier-1.png',
    'carrier-2.png',
    'carrier-3.png',
    'carrier-4.png',
    'carrier-5.png',
    'carrier-6.png',
    'carrier-7.png',
  ]
}

const set = (sprite, anim, play) => {
  if (!anim.textures) {
    anim.textures = [];
    for (const img of anim.images) {
      anim.textures.push(Texture.fromImage(img));
    }
  }

  if (!sprite) {
    sprite = new Pixi.extras.AnimatedSprite(anim.textures);
  }
  sprite.textures = anim.textures;
  sprite.loop = anim.loop;
  sprite.animationSpeed = anim.speed;

  if (play) {
    sprite.gotoAndPlay(0);
  } else {
    sprite.gotoAndStop(0);
  }

  return sprite;
}

const make = (anim, play) => {
  return set(null, anim, play);
}


export default {
  pipe: pipe,
  transporter: transporter,
  make: make,
  set: set
}
