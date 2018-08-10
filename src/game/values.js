import util from '../util/util.js';

const values = {

  transportTime: 1.5,
  transportPause: 1,

  set: function (obj) {
    util.extend(this, obj);
  }
}

export default values
