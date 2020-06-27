const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #totalLength = 0;
  #limit = 0;

  constructor(options) {
    super(Object.assign(options, {decodeStrings: true}));
    this.#limit = options.limit;
    if (!options.objectMode) {
      this.setEncoding('utf8');
    }
  }

  _transform(chunk, encoding, callback) {
    if (this.#totalLength + this._writableState.length <= this.#limit) {
      this.#totalLength += this._writableState.length;
      callback(null, chunk);
    } else {
      callback(new LimitExceededError(), null);
    }
  }
}

module.exports = LimitSizeStream;
