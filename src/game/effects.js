import * as Pixi from 'pixi.js';
import 'pixi-particles';
import mineExplosion from '../assets/effects/mine-explosion.json';
import coinRainOpts from '../assets/effects/coin-rain.json';

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

const coinRain = (container, x = 0, y = 0, width = 100) => {

  coinRainOpts.spawnRect.w = width;

  const emitter = new Pixi.particles.Emitter(
    container,
    [Pixi.Texture.fromImage('ui-coin.png')],
    coinRainOpts
  )

  emitter.updateSpawnPos(x, y);
  emitter.playOnceAndDestroy();

  return emitter;
}

export default {
  explosion: explosion,
  coinRain: coinRain
}