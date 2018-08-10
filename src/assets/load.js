import * as PIXI      from 'pixi.js';
import requiredAssets from './assets.js';
import webFonts       from 'webfontloader';

// TODO: Investigate why preloading images doesn't seem to work properly in Safari.
const assetCache = [];

const pixiLoader = (assets, onProgress) => {

  return new Promise((resolve) => {
    // Access the shared loader.
    const loader = PIXI.loader;

    // Add textures to the loader.
    if (assets.textures) {
      for (let key in assets.textures) {
        loader.add(key, assets.textures[key]);
      }
    }

    // Add sheets to the loader.
    if (assets.sheets) {
      for (let key in assets.sheets) {
        loader.add(key, assets.sheets[key].image, (resource) => {
          if(resource.error) {
            // Display error as we failed to load the image.
            console.error(resource.error);
          } else {
            const texture = resource.texture.baseTexture;
            const sheet = new PIXI.Spritesheet(texture, assets.sheets[key].data);
            sheet.parse((textures) => {});
          }
        });
      }
    }

    // Hook up callbacks.
    loader.onProgress.add((loader, resource) => {
      onProgress(loader.progress);
    });
    loader.onComplete.add((loader, resource) => {
      resolve();
    })

    // Kick off the loading.
    loader.load();
  });

}

const fontLoader = (assets) => {
  return new Promise((resolve) => {
    if (assets.fonts) {

      // TODO: May need to better handle failed loading.
      let config = {
        active: function() {
          resolve();
        },
        inactive: function() {
          resolve();
        },
        // TODO: Hard coding custom here. Need to add support for other formats.
        custom: assets.fonts.custom
      };
      // TODO: Progress is not reported.
      webFonts.load(config);
    } else {
      resolve();
    }
  });
}

const imageLoader = (assets) => {
  return new Promise((resolve) => {
    // TODO: This just kicks off the loading of these images but is not associated with the loader progress or its completion.
    // It's ok in this case because they are only used in the end screen.
    if (assets.images) {
      for (let imgSrc of assets.images) {
        const image = new Image();
        image.src = imgSrc;
        assetCache.push(image);
      }
    }

    resolve();
  });
}



export default function (onProgress) {
  // Get the list of assets we'll be needing.
  let assets = requiredAssets();

  return Promise.all([pixiLoader(assets, onProgress), fontLoader(assets), imageLoader(assets)]);

};
