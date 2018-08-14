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

const minerIdle = {
  loop: true,
  speed: 0.03,
  images: [
    'miner-idle-1.png',
    'miner-idle-1.png',
    'miner-idle-2.png'
  ]
}

const minerWalk = {
  loop: true,
  speed: 0.15,
  images: [
    'miner-walk-1.png',
    'miner-walk-2.png',
    'miner-walk-3.png',
    'miner-walk-4.png',
    'miner-walk-5.png',
    'miner-walk-6.png',
    'miner-walk-7.png'
  ]
}

const minerWork = {
  loop: true,
  speed: 0.15,
  images: [
    'miner-work-1.png',
    'miner-work-2.png',
    'miner-work-3.png',
    'miner-work-4.png',
    'miner-work-5.png',
    'miner-work-6.png',
    'miner-work-7.png',
    'miner-work-8.png',
    'miner-work-9.png',
    'miner-work-10.png',
    'miner-work-11.png',
    'miner-work-12.png'
  ]
}

const minerCarry = {
  loop: true,
  speed: 0.15,
  images: [
    'miner-carry-1.png',
    'miner-carry-2.png',
    'miner-carry-3.png',
    'miner-carry-4.png',
    'miner-carry-5.png',
    'miner-carry-6.png',
    'miner-carry-7.png'
  ]
}

const elevatorWorkerIdle = {
  loop: true,
  speed: 0.07,
  images: [
    'elevator-worker-1.png',
    'elevator-worker-2.png'
  ]
}

const elevatorWorkerWorking = {
  loop: true,
  speed: 0.07,
  images: [
    'elevator-worker-2.png',
    'elevator-worker-3.png',
    'elevator-worker-1.png'
  ]
}

const managerJrWorking = {
  loop: true,
  speed: 0.15,
  images: [
    'manager-jr-work-4.png',
    'manager-jr-work-5.png',
    'manager-jr-work-6.png',
    'manager-jr-work-8.png',
    'manager-jr-work-8.png',
    'manager-jr-work-8.png'
  ]
}

const managerSrWorking = {
  loop: true,
  speed: 0.15,
  images: [
    'manager-sr-work-4.png',
    'manager-sr-work-5.png',
    'manager-sr-work-6.png',
    'manager-sr-work-8.png',
    'manager-sr-work-8.png',
    'manager-sr-work-8.png'
  ]
}

const managerExWorking = {
  loop: true,
  speed: 0.15,
  images: [
    'manager-ex-work-4.png',
    'manager-ex-work-5.png',
    'manager-ex-work-6.png',
    'manager-ex-work-8.png',
    'manager-ex-work-8.png',
    'manager-ex-work-8.png'
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
  minerIdle: minerIdle,
  minerWalk: minerWalk,
  minerWork: minerWork,
  minerCarry: minerCarry,
  elevatorWorkerIdle: elevatorWorkerIdle,
  elevatorWorkerWorking: elevatorWorkerWorking,
  managerJrWorking: managerJrWorking,
  managerSrWorking: managerSrWorking,
  managerExWorking: managerExWorking,
  make: make,
  set: set
}
