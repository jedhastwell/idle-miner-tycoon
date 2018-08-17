const util = {};

// Convenience methods to test for type values.
util.is = {
  // Is the value considered an object.
  obj: a => Object.prototype.toString.call(a).indexOf('Object') !== -1,
  // Is the value considered an Array.
  arr: a => Array.isArray(a),
  // Is the value considered an string.
  str: a => typeof a === 'string',
  // Is the value considered an function.
  fnc: a => typeof a === 'function',
  // Is the value undefined.
  und: a => typeof a === 'undefined',
  // Is the value empty (null or undefined).
  nil: a => util.is.und(a) || a === null
};

// Extends object 'a' with the properties of object 'b'.
util.extend = (a, b) => {
  for (const prop in b) {
    a[prop] = b[prop];
  }
  return a;
}

// Returns a new object with the properties of both 'a' and 'b'.
util.merge = (a, b) => {
  const merged = {};
  util.extend(merged, a);
  util.extend(merged, b);
  return merged;
};

util.limitNum = (x, min, max) => {
  return Math.max(min, Math.min(max, x));
}

// Adjusts one edge of the given size such that the new size is within the specified aspect ratio limits.
util.limitToRatio = function (size, horzRatio, horzRatioWide, vertRatio, vertRatioTall) {

  // Is the given size landscape or portrait?
  const landscape = size.width > size.height;
  // Get minimum ratio for this layout.
  const minRatio = landscape ? horzRatio : vertRatioTall;
  // Get maximum ratio for this layout.
  const maxRatio = landscape ? horzRatioWide : vertRatio;

  // Get the current ratio.
  const sizeRatio = size.width / size.height;

  // Default to same size.
  const adjusted = {
    width: size.width,
    height: size.height
  };

  // Adjust size to fit best aspect ratio if required
  if (sizeRatio > maxRatio) {
    adjusted.width = size.height * maxRatio;
  } else if (sizeRatio < minRatio) {
    adjusted.height = size.width / minRatio;
  }

  return adjusted;
}


util.scaledFit = function (size, target) {

  let sizeRatio = size.width / size.height;
  let targetRatio = target.width / target.height;

  if (sizeRatio > targetRatio) {
    // Vertical layout.
    return {
      width: target.height * sizeRatio,
      height: target.height
    }
  } else {
    // Horizontal layout.
    return {
      width: target.width,
      height: target.width / sizeRatio
    }
  }
}

// Returns an new size that matches the aspect ratio of size that fits inside of target
util.resizeToFit = function (size, target) {

  let sizeRatio = size.width / size.height;
  let targetRatio = target.width / target.height;

  if (sizeRatio > targetRatio) {
    return {
      width: target.width,
      height: target.width / sizeRatio
    }
  } else {
    return {
      width: target.height * sizeRatio,
      height: target.height
    }
  }
}



util.throttle = (fn, timespan, delay) => {
  let throttled = false;

  return function () {
    if (!throttled) {
      throttled = true;
      setTimeout(() => {
        throttled = false;
        if (delay) {
          return fn.apply(this, arguments);
        }
      }, timespan);
      if (!delay) {
        return fn.apply(this, arguments);
      }
    }
  }
}


export default util;
