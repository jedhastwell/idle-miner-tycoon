import util from '../util/util.js';
// defaults, data, options, stats, settings, units, figures, details, values, specs, features, attributes
const values = {

  // Forces portrait layout event when device is in landscape orientation.
  rotateWhenLandscape: true,

  // Distance in pixels between the left side of the refinary and the right side of the warehouse.
  worldSpan: 750,

  // Pixels per second the elevator moves at.
  elevatorSpeed: 260,
  
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
  minerWalkTime: 1.2,
  // Seconds the miner rests for after working
  minerRestTime: 0.8,

  // Number of units required to display the full load sprite.
  elevatorFullLoadAmount: 4.5,
  // Seconds the elevator takes to change size.
  elevatorResizeTime: 0.5,

  // Time to unload mineshaft in seconds per amount unit 
  mineshaftUnloadTime: 0.2,

  // Time to unload refinary in seconds per amount unit
  refinaryUnloadTime: 0.3,

  // Maximum number of amount units to consider when calculating unload time
  unloadTimeMaxAmount: 5,

  // Maximum number of mineshafts that can be purchased.
  maxMineshafts: 3,

  // Number of mineshafts that get built at the start of the game.
  startingMineshafts: 1,

  // Amount of cash each unit amount is worth.
  cashPerAmount: 50,

  // Amount of cash required to complete the game.
  targetCash: 500,

  // Cash multiplier each mineshaft level produces.
  levelAmounts: [1, 1.5, 2],

  // Cost of each manager.
  managerCosts: [50, 75],

  // Specifies if the first mineshaft should already have a manager
  mineshaft1Manager: false,
  // Specifies if the 2nd mineshaft should already have a manager
  mineshaft2Manager: false,
  // Specifies if the 3rd mineshaft should already have a manager
  mineshaft3Manager: false,
  // Specifies if the elevator should already have a manager
  elevatorManager: false,
  // Specifies if the warehouse should already have a manager
  warehouseManager: false,

  // Cost of each mineshaft.
  mineshaftCosts: [0, 50, 75],

  // Text to display when the game over sequence runs.
  gameOverText: 'LEVEL COMPLETE',

  // Text to display in the speach bubble in the intro.
  introText: 'Tap to start your mine!',

  // Text to display on the new mineshaft button.
  newShaftText: 'New Shaft',

  // Text to display on the new manager button.
  newManagerText: 'Manager',

  // Help text to display with the pointer for the new shaft button.
  tooltipNewShaft: null,

  // Help text to display with the pointer for the new manager button.
  tooltipNewManager: null,

  // Help text to display with the pointer for the mineshaft worker.
  tooltipMineshaft: "Tap to dig",

  // Help text to display with the pointer for the elevator worker.
  tooltipElevator: "Tap to\ntransport",

  // Help text to display with the pointer for the warehouse worker.
  tooltipWarehouse: "Tap to\ncollect",

  // Specifies if the in-game cta should be displayed.
  inGameCta: false,

  // Number of seconds of user idle time to wait before jumping to the end screen.
  idleTimeout: null,

  // Number of seconds to wait before auto-clicking the next clickable element.
  autoClickTimeout: 4,

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

    Object.entries(this).forEach(([key, value]) => {
      if (util.is.str(value)) {
        this[key] = this[key].split('{n}').join('\n');
      }
    });

    return this;
  },

  mergeOptions: function (options) {
    
    if ('speed' in options) {

      if (options.speed === 2) {
        this.set(values.presets.fast);
      };
  
      if (options.speed === 3) {
        this.set(values.presets.superFast);
      };

      delete options.speed;
    }

    return this.set(options);
  },

  presets: {
    fast: {
      minerWorkTime: 0.6,

      minerWalkTime: 0.5,

      minerRestTime: 0.2,

      elevatorSpeed: 280,

      warehouseWalkTime: 0.8,

      mineshaftUnloadTime: 0.2,

      refinaryUnloadTime: 0.2
    },

    superFast: {
      minerWorkTime: 0.4,

      minerWalkTime: 0.3,

      minerRestTime: 0.1,

      elevatorSpeed: 450,

      warehouseWalkTime: 0.6,

      mineshaftUnloadTime: 0.3,

      refinaryUnloadTime: 0.2,

      unloadTimeMaxAmount: 1,
    }
  }
}

export default values
