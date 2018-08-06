
class Screen {

  constructor () {
    this.element = null;
  }

  template () {
    throw new Error('template function must be overridden');
  }

  show (fadeTime, parentNode = document.body) {
    // Create the screen from the template.
    const div = document.createElement('div');
    div.innerHTML = this.template();
    this.element = div.firstChild;

    // Fade out the screen.
    this.element.style.opacity = 0;
    this.element.style.transition = `opacity ${fadeTime}s`;

    setTimeout(() => {
      this.element.style.opacity = 1;
    }, 50);


    // Add to DOM.
    parentNode.appendChild(this.element);
  }

  hide (fadeTime = 0, callback) {
    if (this.element) {

        // Fade out the screen.
        this.element.style.opacity = 0;
        this.element.style.transition = `opacity ${fadeTime}s`;

        // Remove the div from the document.
        setTimeout(() => {
          this.element.parentNode.removeChild(this.element);
          this.element = null;
          if (callback) {
            callback();
          }
        }, fadeTime * 1000);

    } else if (callback) {
      // If there is no element then show was never called. Just call the callback.
      callback();
    }
  }

}


export default Screen
