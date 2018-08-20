require('./fonts/fonts.css');
// For webpack public path override to work, we need add require statements in a function call.
export default function () {

  return {
    images : [
      require('./images/logo.png'),
      require('./images/menu-bg.jpg'),
      require('./images/ui-button.png')
    ],
    textures: {
      'sky.png': require('./images/sky.png'),
      'ui-button.png': require('./images/ui-button.png')
    },
    sheets: {
      'atlas': {
        image : require('./images/atlas.png'),
        data  : require('./images/atlas.json')
      }
    },
    fonts: {
      custom: {
        families: ['LeageSpartan']
      }
    }
  }

};
