'use strict'

var Writable = require('readable-stream').Writable,
    Inherits = require('util').inherits

function Drain (handler) {
  Writable.call(this, {
    objectMode: true
  })

  this.handler = handler
}

Inherits(Drain, Writable)

Drain.prototype._write = function (msg, enc, done) {
  this.handler(msg, done)
}

module.exports = function (handler) {
  return new Drain(handler)
}
