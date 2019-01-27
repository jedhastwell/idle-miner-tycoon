require('./polyfills/polyfills.js');
import LoadScreen from './screens/loadScreen.js';

let loadScreen;
let Application;

/*
  The onReady event occurs once the document and environment (e.g. MRAID) are
  ready and once your application settings are available which are passed as an
  object to your callback.
 */
PlayableKit.onReady(function (options) {

  console.log(`%c  - ${APP_NAME} - v${APP_VERSION} - `,
        'font-size:12px;background:#5AF5BB;color:#760701');

  // Set default background color.
  document.body.style.background = options.background || '#000000';

  // Override webpack public path.
  __webpack_public_path__ = PlayableKit.appPath;

  // Your application loading code is now ready to run but may not yet be on screen.
  loadScreen = new LoadScreen(options.loadScreen);

  // Downlaod application.
  let appScript = Promise.resolve();

  if (INLINE) {
    Application = require('./app.js').default;
  } else {
    appScript = require.ensure('./app.js', () => {
      Application = require('./app.js').default;
      loadScreen.progressBy(30);
    }, 'app');
  }

  appScript
  // Tell application to load the assets it needs.
  .then(() => {
    return Application.load((progress) => {
      loadScreen.progressTo(30 + 70 * progress / 100);
    });
  })
  // Tell PlayableKit we are ready to start.
  .then(() => {
    // Send analytics that everything has loaded.
    PlayableKit.analytics.loaded();

    // Tell playable kit that you are ready to start. This will raise the
    // onStart callback as soon as the app is viewable.
    PlayableKit.start();
  });

});

/*
  In an MRAID environment, your application may be pre-loaded in the background.
  The onViewable event occurs after onReady has triggered and as soon as your
  application is being presented on screen.
 */
PlayableKit.onViewable(function (options) {

  // Your application is ready to display on screen.
  if (!INLINE && !PlayableKit.started) {

    // Send analytics that the user is seeing a loading screen.
    PlayableKit.analytics.loading();

    // Show a loading screen.
    loadScreen.show();
  }

});

/*
  The onStart event provides a convenient way to pause the starting of your
  application until you have completed loading of all your assets AND your
  application has been presented on screen. You must call PlayableKit.start()
  to queue up the triggering of this event. It will only trigger after
  onViewable has triggered.
 */
PlayableKit.onStart(function (options) {
  const app = new Application(options);

  // Hide laoding screen if it was visible.
  loadScreen.hide(() => {
    app.start();
  });

})
