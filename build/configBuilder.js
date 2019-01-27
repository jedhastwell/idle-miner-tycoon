const getDefaults = require('json-schema-defaults');
const pkOptions   = require('./pk-options.json');
const appSchema   = require('../src/config.json');

const manifest = {
  appLauncher: APP_LAUNCHER,
  appPath    : PUBLIC_PATH,
  targetUrl  : TARGET_URL
}

let settings = pkOptions;
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
