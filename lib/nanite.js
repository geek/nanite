'use strict'

var Transform = require('readable-stream').Transform,
    Inherits = require('util').inherits,
    parallel = require('fastparallel')(),
    extend = require('extend'),
    bloomrun = require('bloomrun')

function Nanite (config) {
  if (!(this instanceof Nanite)) {
    return new Nanite(config)
  }

  Transform.call(this, {
    objectMode: true,
    highWaterMark: 16
  })

  this.on('pipe', function (source) {
    this.on('end', function () {
      source.end()
    })
  })

  var defaultConfig = {
    multiMode: false,
    passthrough: false,
  }

  this.config = extend(defaultConfig, config)
  this.handlers = bloomrun()
}

Inherits(Nanite, Transform)

Nanite.prototype._transform = function (msg, enc, done) {
  var handlers = null

  if (!this.config.multiMode) {
    var handler = this.handlers.lookup(msg)
    if (handler) {
      handlers = [handler]
    }
  } else {
    handlers = this.handlers.list(msg)
  }

  if (!handlers) {
    this.push(msg)
    return done()
  }

  function next (handler, done) {
    handler.write(msg, done)
  }

  function complete (err) {
    if (this.config.passthrough) {
      this.push(msg)
    }

    return done(err)
  }

  parallel(this, next, handlers, complete)
}

Nanite.prototype.pin = function (pattern) {
  var that = this

  return function (handler) {
    return that.when(pattern, handler)
  }
}

Nanite.prototype.when = function (pattern, handler) {
  this.handlers.add(pattern, handler)
  return handler
}

Nanite.prototype.remove = function (pattern, handler) {
  this.handlers.remove(pattern, handler)
}

module.exports = Nanite
