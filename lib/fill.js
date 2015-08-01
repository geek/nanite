'use strict'

var Readable = require('readable-stream').Readable,
    Inherits = require('util').inherits

function Fill (msgs) {
  Readable.call(this, {
    objectMode: true,
    highWaterMark: 16
  })

  this.messages = msgs
  this._index = 0
}

Inherits(Fill, Readable)

Fill.prototype._read = function () {
  if (this._index === this.messages.length) {
    return this.push(null)
  }

  var msg = this.messages[this._index ++]
  this.push(msg)
}

module.exports = function (msgs) {
  return new Fill(msgs)
}
