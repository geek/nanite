
// get the nanite builder function and take a
// copy of both the fill and drain functions.
var Nanite = require('../lib/nanite'),
    drain = require('nanite-drain'),
    fill = require('nanite-fill')

// set nanite to multi mode
var nanite = Nanite({multiMode: true})

// set up the first handler
nanite.when({cmd: 'test'}, drain(function (msg, done) {
  console.log('Hello')
  done()
}))

// notice the second handler is the same as the first
nanite.when({cmd: 'test'}, drain(function (msg, done) {
  console.log('World')
  done()
}))

// will be handled twice now
nanite.write({cmd: 'test'})
