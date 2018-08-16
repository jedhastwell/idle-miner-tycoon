import util from '../util/util.js';
// defaults, data, options, stats, settings, units, figures, details, values, specs, features, attributes
const values = {

  // Distance in pixels between the left side of the refinary and the right side of the warehouse.
  worldSpan: 750,

  // Pixels per second the elevator moves at.
  elevatorSpeed: 160,
  
  // Pixels down from the surface for the top of 'ground level' (elevator idle position)
  groundLevelTop: 54,
  // Pixels down from the surface for the top of the first mineshaft level
  firstLevelTop: 180,
  // Pixels between the bottom of one mineshaft and the top of the next
  levelSpacing: 100,
  // Height of a mineshaft.
  levelHeight: 159,

  // Seconds the warehouse worker takes to walk between buildings
  warehouseWalkTime: 1.5,

  // Seconds the mineshaft worker digs for
  minerWorkTime: 1,
  // Seconds the mineshaft worker takes to walk back and forwards
  minerWalkTime: 1.5,
  // Seconds the miner rests for after working
  minerRestTime: 0.6,

  // Number of units required to display the full load sprite.
  elevatorFullLoadAmount: 4.5,
  // Seconds the elevator takes to change size.
  elevatorResizeTime: 0.5,

  mineshaftUnloadTime: 0.4,

  refinaryUnloadTime: 0.4,

  // Amount of cash each unit amount is worth.
  cashPerAmount: 50,

  // Amount of cash required to complete the game.
  targetCash: 1000,

  getCash: (value) => {
    return value * values.cashPerAmount;
  },

  getMineUnloadTime: (amount) => {
    return values.mineshaftUnloadTime * amount;
  },

  getRefinaryUnloadTime: (amount) => {
    return values.refinaryUnloadTime * amount;
  },

  set: function (obj) {
    util.extend(this, obj);
  }
}

export default values
