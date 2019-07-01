const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const chunkStr = chunk.toString();
    const lines = chunkStr.split(os.EOL);

    if (this.lineNoEOL) {
      lines[0] = this.lineNoEOL + lines[0];
      this.lineNoEOL = null;
    }

    if (!chunkStr.endsWith(os.EOL)) {
      this.lineNoEOL = lines.pop();
    }

    lines.forEach(line => {
      this.push(line);
    })

    callback();
  }

  _flush(callback) {
    if (this.lineNoEOL) {
      this.push(this.lineNoEOL);
      this.lineNoEOL = null;
    }

    callback();
  }
}

module.exports = LineSplitStream;
