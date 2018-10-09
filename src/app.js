import Core           from './core.js';
import Engine         from './engine/engine.js';
import loadAssets     from './assets/load.js';
import Game           from './game/game.js';
import EndScreen      from './screens/endScreen.js';
import values         from './game/values.js';

class Application {

  constructor (options) {

    values.mergeOptions(options.game);

    const engine = Core.engine = new Engine({
      forceOrientation: values.rotateWhenLandscape ? 'portrait' : null
    });

    const game = new Game();
    const end = new EndScreen(options.endScreen);

    engine.stage.addChild(game);

    game.on('complete', (timeout) => {
      end.show(1.5);
      if (timeout) {
        PlayableKit.analytics.view('end_timeout');
      } else {
        PlayableKit.analytics.end();
      }
    });

    end.onReplay(() => {
      end.hide(1);
      game.restart();
    });

    this.start = () => {
      game.start();
    }
  
  }

  
}

Application.load = loadAssets;

export default Application;
