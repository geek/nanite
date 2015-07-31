var Writable = require('readable-stream').Writable
var Inherits = require('util').inherits

function Into (handler) {
  if (!(this instanceof Into)) {
    return new Into(handler)
  }

  Writable.call(this, {
    objectMode: true,
    highWaterMark: 16
  })

  this.handler = handler
}

Inherits(Into, Writable)

Into.prototype._write = function (msg, enc, done) {
  this.handler(msg, done)
}

module.exports = Into
