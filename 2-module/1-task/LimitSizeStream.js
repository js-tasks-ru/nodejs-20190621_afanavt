const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.allBuffersBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    this.allBuffersBytes += chunk.byteLength;

    if (this.allBuffersBytes > this.limit) {
      callback(new LimitExceededError());
    }

    callback(null, chunk);

  }
}

module.exports = LimitSizeStream;
