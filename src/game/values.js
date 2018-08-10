import util from '../util/util.js';

const values = {

  transportTime: 1.5,
  transportPause: 1,
  minerWorkTime: 2,
  minerWalkTime: 1.5,

  crateUnloadTime: 0.6,

  set: function (obj) {
    util.extend(this, obj);
  }
}

export default values
