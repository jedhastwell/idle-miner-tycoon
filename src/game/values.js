import util from '../util/util.js';

const values = {

  elevatorSpeed: 160,
  groundLevelTop: 54,
  firstLevelTop: 180,
  levelSpacing: 100,
  levelHeight: 159,

  transportTime: 1.5,
  transportPause: 1,
  minerWorkTime: 2,
  minerWalkTime: 1.5,

  crateUnloadTime: 0.6,

  mineUnloadTime: 0.4,
  refinaryUnloadTime: 0.5,

  getMineUnloadTime: (amount) => {
    return values.mineUnloadTime * amount;
  },

  getRefinaryUnloadTime: (amount) => {
    return values.refinaryUnloadTime * amount;
  },

  set: function (obj) {
    util.extend(this, obj);
  }
}

export default values
