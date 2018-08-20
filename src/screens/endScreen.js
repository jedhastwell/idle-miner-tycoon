import Screen from './screen.js';
import util   from '../util/util.js';

require('./end-screen.css');
const template = require('ejs-loader!./end-screen.ejs');

const defaults = {
  fadeOutTime: 0.5,
  minDisplayTime: 1,
  ctaButtonText: 'Install Now',
  replayButtonText: 'Try Again',
  maxPlays: -1
}

class EndScreen extends Screen {

  constructor (options = {}) {

    super();
    // Set options by merging with defaults.
    this.options = util.merge(defaults, options);
  }

  template () {
    return template(this.options);
  }

  show (fadeTime, parentNode = document.body) {
    super.show(fadeTime, parentNode);

    EndScreen.plays = (EndScreen.plays || 0) + 1;

    const ctaButton = this.element.querySelector('.js-button-cta');
    ctaButton.onclick = () => {
      PlayableKit.open();
    }

    const replayButton = this.element.querySelector('.js-button-replay');

    if (this.options.maxPlays <= 0 || EndScreen.plays < this.options.maxPlays) {
      replayButton.onclick = () => {
        if (this._onReplay) {
          // Hack
          replayButton.onclick = null;
          this._onReplay();
        }
      }
    } else {
      replayButton.style.display = 'none';
    }


  }

  onReplay (callback) {
    this._onReplay = callback;
  }

}


export default EndScreen
