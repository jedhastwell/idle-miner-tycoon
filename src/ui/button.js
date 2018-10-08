import {Container, Sprite} from 'pixi.js';
import TweenLite from 'TweenLite';


class Button extends Container {

	constructor(staticTexture, options = {}) {
		super();

		this._state = Button.State.STATIC;

		this.textures = {};
		this.textures[Button.State.STATIC] = staticTexture;

		if('activeTexture' in options) {
			this.textures[Button.State.ACTIVE] = options.activeTexture;
		}

		if('disabledTexture' in options) {
			this.textures[Button.State.DISABLED] = options.disabledTexture;
		}

    // Sprite that will display the button.
    this.sprite = new Sprite(staticTexture);
		this.sprite.anchor.set(0.5);
		this.sprite.position.set(this.sprite.width / 2, this.sprite.height / 2);
    this.addChild(this.sprite);

		// Assign mouse events to button sprite.
		this.sprite.interactive = true;
		this.sprite.on('mousedown', this.onDown.bind(this));
		this.sprite.on('mousemove', this.onMove.bind(this));
		this.sprite.on('mouseup', this.onUp.bind(this));
		// Assign touch events to button sprite.
		this.sprite.on('touchstart', this.onDown.bind(this));
		this.sprite.on('touchmove', this.onMove.bind(this));
		this.sprite.on('touchend', this.onUp.bind(this));

		Button.attachScaleBehavior(this);
	}

	get state() {
    return this._state;
  }

  set state(value) {
		// Check that new state value is valid.
    if(!(value in Button.State)) {
			throw 'Expected value of type Button.State but received ' +  value;
		}

		// Only proceed if state provided is different.
		if(this._state !== value) {

			// Set scale.
			const t = this.textures;
			const oldState = this._state;

			// Update texture if required.
			if(t[value] && t[this._state] !== t[value]) {
				this.sprite.texture = t[value];
			}

			// Change state.
			this._state = value;

			// Emit state change event.
			this.emit('stateChanged', {
				oldState: oldState,
				newState: value
			});

		}

  }

	get disabled() {
		return this.state === Button.State.DISABLED;
	}

	set disabled(value) {
		if (value !== this.disabled) {
			if (value) {
				this.state = Button.State.DISABLED;
			} else {
				this.state = Button.State.STATIC;
			}
		}
	}

	onDown(e) {
		if(this.state === Button.State.STATIC) {
			this.state = Button.State.ACTIVE;
		}
	}

	onMove(e) {
		if(this.state === Button.State.ACTIVE) {
			if(!this.sprite.containsPoint(e.data.global)) {
				this.state = Button.State.STATIC;
			}
		}
	}

	onUp(e) {
		if(this.state === Button.State.ACTIVE) {
			this.state = Button.State.STATIC;
			this.emit('pressed', this, e);
		}
	}


	static attachScaleBehavior(button, options = {}) {

		const settings = {
			time  			  : options.time 					|| 100,
			easing			  : options.easing 				|| Quad.easeInOut,
			scaleStatic   : options.scaleStatic 	|| {x: 1, y: 1},
			scaleActive   : options.scaleActive 	|| {x: 0.9, y: 0.9},
			scaleDisabled : options.scaleDisabled || {x: 1, y: 1}
		}

		const animateScale = function(to) {
			TweenLite.to(button.sprite.scale, 0.1, {x: to.x, y: to.y, ease: settings.easing});
		}

		button.on('stateChanged', (e) => {
			switch (e.newState) {
				case Button.State.STATIC:
					animateScale(settings.scaleStatic);
					break;

				case Button.State.ACTIVE:
					animateScale(settings.scaleActive);
					break;

				case Button.State.DISABLED:
					animateScale(settings.scaleDisabled);
					break;

				default:
			}
		});
	}

}

Button.State = {
  STATIC: 'STATIC', 
  ACTIVE: 'ACTIVE', 
  DISABLED: 'DISABLED'
}


export default Button



