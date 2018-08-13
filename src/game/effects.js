import * as Pixi from 'pixi.js';
import 'pixi-particles';
import mineExplosion from '../assets/effects/mine-explosion.json';

const explosion = (container, x = 0, y = 0) => {
  const emitter = new Pixi.particles.Emitter(
    container,
    [Pixi.Texture.fromImage('explosion-particle.png')],
    mineExplosion
  );

  emitter.updateSpawnPos(x, y);
  emitter.playOnceAndDestroy();

  return emitter;
}

export default {
  explosion: explosion
}