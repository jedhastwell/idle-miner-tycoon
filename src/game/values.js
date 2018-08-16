import util from '../util/util.js';

const values = {

  worldSpan: 750,

  elevatorSpeed: 160,
  groundLevelTop: 54,
  firstLevelTop: 180,
  levelSpacing: 100,
  levelHeight: 159,

  transportTime: 1.5,
  transportPause: 1,
  minerWorkTime: 1,
  minerWalkTime: 1.5,

  crateUnloadTime: 0.6,

  elevatorFullLoadAmount: 4.5,
  elevatorResizeTime: 0.5,

  mineUnloadTime: 0.4,
  refinaryUnloadTime: 0.4,

  cashPerAmount: 50,

  targetCash: 1000,

  getCash: (value) => {
    return value * values.cashPerAmount;
  },

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
