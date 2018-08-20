import Screen from './screen.js';
import util   from '../util/util.js';

require('./load-screen.css');
const template = require('ejs-loader!./load-screen.ejs');

const defaults = {
  fadeOutTime: 0.5,
  minDisplayTime: 1
}

class LoadScreen extends Screen {

  constructor (options = {}) {

    super();
    // Set options by merging with defaults.
    this.options = util.merge(defaults, options);

    this._percentage = 0;
  }

  template () {
    return template();
  }

  progressTo (percentage) {
    this._percentage = Math.min(Math.max(0, percentage || 0), 100);
    if (this.element) {
      const el = this.element.querySelector('.js-progress');
      if (el) {
        el.style.width = `${this._percentage}%`;
      }
    }
  }

  progressBy (percentage) {
    this.progressTo(this._percentage + percentage);
  }

  show (parentNode = document.body) {

    super.show(0, parentNode);

    // Take note of the time when we show the load screen.
    this.timeDisplayed = Date.now();

    // Match progress.
    this.progressTo(this._percentage);
  }

  hide (callback) {

    if (this.element) {
      let delay = this.options.minDisplayTime;
      delay -= (Date.now() - this.timeDisplayed) / 1000;

      setTimeout(() => {
        super.hide(this.options.fadeOutTime, callback);
      }, delay * 1000);
    }

  }

}


export default LoadScreen
