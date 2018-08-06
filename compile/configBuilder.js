const getDefaults    = require('json-schema-defaults');

const pkSchema       = require('./pk-schema.json');
const appSchema      = require('../src/config.json');

const manifest = {
  appLauncher: APP_LAUNCHER,
  appPath    : PUBLIC_PATH,
  targetUrl  : TARGET_URL
}

let settings = getDefaults(pkSchema);
const appConfig = getDefaults(appSchema);

settings.config = settings.config || {};
settings.config.application = appConfig;

settings = JSON.parse(JSON.stringify(settings), (key, value) => {
  for (let insertKey in manifest) {
    if (value == `{{${insertKey}}}`) {
      return manifest[insertKey];
    }
  }
  return value;
});



module.exports = settings;
