import Core           from './core.js';
import Engine         from './engine/engine.js';
import loadAssets     from './assets/load.js';
import Game           from './game/game.js';


class Application {

  constructor (options) {

    const engine = Core.engine = new Engine();

    const game = new Game(options.game);

    engine.stage.addChild(game);

    game.on('complete', () => {
      PlayableKit.analytics.gameOver(true, game.score);
    });

  }

}

Application.load = loadAssets;

export default Application;
