import Screen from './screen.js';
import util   from '../util/util.js';

require('./end-screen.css');
const template = require('ejs-loader!./end-screen.ejs');

const defaults = {
  fadeOutTime: 0.5,
  minDisplayTime: 1,
  ctaButtonText: 'Install Now',
  replayButtonText: 'Try Again'
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

    const ctaButton = this.element.querySelector('.js-button-cta');
    ctaButton.onclick = () => {
      PlayableKit.open();
    }

    const replayButton = this.element.querySelector('.js-button-replay');
    replayButton.onclick = () => {
      
    }
  }

}


export default EndScreen
