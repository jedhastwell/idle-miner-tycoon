import * as Pixi    from 'pixi.js';
import EventEmitter from 'eventemitter3';
import util         from '../util/util.js';
import TweenLite    from 'TweenLite';

const defaults = {
  pixi    : {
    antialias: true,
    backgroundColor: 0x2E6597
  },
  targetSize: {
    width : 750,
    height: 750
  },
  ratios: {
    thin  : 4/3,
    wide  : 8/3,
    short : 3/4,
    tall  : 3/8
  },
  forceOrientation: null
}

class Engine extends EventEmitter {

  static get () {
    return this._instance || null;
  }

  constructor (options = {}) {

    if (Engine._instance) {
      throw new Error('Cannot instantiate multiple instances of Engine');
    }

    super();

    this.options = util.merge(defaults, options);

    // Create new PIXI instance.
    this._pixi = new PIXI.Application(this.options.pixi);

    // Add the canvas to the document.
    document.body.appendChild(this._pixi.view);

    // Adjust size to match window.
    this.layout(PlayableKit.getScreenSize());

    // Update layout when the window is resized.
    // Adding delay because safari on mobile does not report window dimensions correctly during resize.
    PlayableKit.onResize(this.layout.bind(this));

    // Use GSAP ticker to run our game loop.
    TweenLite.ticker.fps(60)
    // Set initial time for calculating time elapsed between frames.
    this._prevLoopTime = TweenLite.ticker.time;
    // Hook the GSAP ticker.
    TweenLite.ticker.addEventListener('tick', this.loop, this);

    Engine._instance = this;
  }


  layout (size) {
    // Get the size we are fitting into.
    const viewport = size;

    // Find the size that best fits into the viewport without exceeding the ratio limits.
    const letterboxed = util.limitToRatio(
      viewport,
      this.options.ratios.thin,
      this.options.ratios.wide,
      this.options.ratios.short,
      this.options.ratios.tall
    );

    // Calculate the size that matches the ratio but best fits with our target size.
    const scaled = util.scaledFit(letterboxed, this.options.targetSize);
    // This is considered the screen size as far as other game components are concerned.
    this._screen = scaled;
    // Resize the renderer to match this.
    this._pixi.renderer.resize(scaled.width, scaled.height);

    // Style the canvas so that it fits the size of the window and add margins to
    // letterbox correctly. The browser will handle scaling from our renderer dimensions.
    const canvas = this._pixi.view;
    canvas.style.width = letterboxed.width + 'px';
    canvas.style.height = letterboxed.height + 'px';
    canvas.style.marginLeft = Math.floor((viewport.width - letterboxed.width) / 2) + 'px';
    canvas.style.marginTop = Math.floor((viewport.height - letterboxed.height) / 2) + 'px';

    this._scale = new Pixi.Point(
      letterboxed.width / scaled.width / this._pixi.renderer.resolution,
      letterboxed.height / scaled.height  / this._pixi.renderer.resolution
    );

    
    // Check if we should rotate the stage to force a particular orientation.
    const force = this.options.forceOrientation;
    const rotate = (force == 'portrait' && scaled.width > scaled.height) 
      || (force == 'landscape'&& scaled.width < scaled.height);
    
    if (rotate) {
      this._screen = {width: this._screen.height, height: this._screen.width};
      this.stage.rotation = -Math.PI / 2;
      this.stage.position.set(0, this._screen.width);
    } else {
      this.stage.rotation = 0;
      this.stage.position.set(0,0);
    }

    // Emit resize event.
    this.emit('resize', this.screen, this.scale);

  }

  loop () {
    // Calculate time since previous frame.
    const elapsed = TweenLite.ticker.time - this._prevLoopTime;

    // Store current time for next iteration.
    this._prevLoopTime = TweenLite.ticker.time

    // Declare tick with elapsed time.
    this.emit('tick', elapsed);
  }

  wait (duration) {
    return new Promise((resolve) => {
      let time = 0;

      const update = (elapsed) => {
        time += elapsed;
        if (time >= duration) {
          this.off('tick', update);
          resolve();
        }
      }

      this.on('tick', update);
    });
  }

  get clearColor () {
    return this._pixi.renderer.backgroundColor;
  }

  set clearColor (value) {
    this._pixi.renderer.backgroundColor = value;
  }

  get stage () {
    return this._pixi.stage;
  }

  set stage (value) {
    if (value !== this._pixi.stage) {
      this._pixi.stage = value;
      // Need to re-layout so that stage is scaled correctly.
      this.layout(PlayableKit.getScreenSize());
      // Render immediately.
      this._pixi.render();
    }
  }

  get screen () {
    return this._screen;
  }

  get scale () {
    return this._scale;
  }

}

export default Engine;
