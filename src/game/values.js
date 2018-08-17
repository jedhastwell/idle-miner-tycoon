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

  // Time to unload mineshaft in seconds per amount unit 
  mineshaftUnloadTime: 0.3,

  // Time to unload refinary in seconds per amount unit
  refinaryUnloadTime: 0.3,

  // Maximum number of amount units to consider when calculating unload time
  unloadTimeMaxAmount: 5,

  // Maximum number of mineshafts that can be purchased.
  maxMineshafts: 3,

  // Amount of cash each unit amount is worth.
  cashPerAmount: 50,

  // Amount of cash required to complete the game.
  targetCash: 1000,

  // Cash multiplier each mineshaft level produces.
  levelAmounts: [1, 1.5, 2],

  // Cost of each manager.
  managerCosts: [50, 100],

  // Cost of each mineshaft.
  mineshaftCosts: [0, 150, 200],

  // Text to display when the game over sequence runs.
  gameOverText: 'LEVEL COMPLETE',

  getCash: (value) => {
    return value * values.cashPerAmount;
  },

  getMineUnloadTime: (amount) => {
    return values.mineshaftUnloadTime * util.limitNum(amount, 0, values.unloadTimeMaxAmount);
  },

  getRefinaryUnloadTime: (amount) => {
    return values.refinaryUnloadTime * util.limitNum(amount, 0, values.unloadTimeMaxAmount);
  },

  getManagerCost: (managerNum) => {
    return values.managerCosts[util.limitNum(managerNum - 1, 0, values.managerCosts.length - 1)];
  },

  getMineshaftCost: (levelNum) => {
    return values.mineshaftCosts[util.limitNum(levelNum - 1, 0, values.mineshaftCosts.length - 1)];
  },

  getAmountForLevel: (levelNum) => {
    return values.levelAmounts[util.limitNum(levelNum - 1, 0, values.levelAmounts.length - 1)];
  },

  set: function (obj) {
    util.extend(this, obj);
  },

  presets: {
    speed: {
      minerWorkTime: 0.3,

      minerWalkTime: 0.4,

      minerRestTime: 0.1,

      elevatorSpeed: 250,

      warehouseWalkTime: 0.6,

      mineshaftUnloadTime: 0.2,

      refinaryUnloadTime: 0.2
    }
  }
}

export default values
