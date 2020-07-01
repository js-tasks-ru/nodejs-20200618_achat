const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #str = '';

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    this.#str += chunk;
    let strArr = this.#str.split(os.EOL);
    if (strArr.length > 1) {
      this.#str = strArr.pop();
      strArr.forEach(s => this.push(s));
    }
    callback();
  }

  _flush(callback) {
    this.push(this.#str);
    callback();
  }
}

module.exports = LineSplitStream;
