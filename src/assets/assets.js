require('./fonts/fonts.css');
// For webpack public path override to work, we need add require statements in a function call.
export default function () {

  return {
    images : [
    ],
    textures: {
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
