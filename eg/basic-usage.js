'use strict'

// create a new instance of nanite and take a
// copy of both the fill and drain builders.
var nanite = require('../lib/nanite')(),
    drain = require('nanite-drain'),
    fill = require('nanite-fill')

// set up a basic handler, this should be called
// as many times as there are objects passed to fill.
var handlePrint = nanite.pin({cmd: 'print'})

// drain is a simple write stream that accepts a
// backpressure supported function.
handlePrint(drain(function (msg, done) {
  console.log('Message ' + msg.val + ' handled')
  done()
}))

// fill accepts an array of messages and returns
// a primed readable stream. To push the messages
// into nanite is as simple as piping fill to it.
fill([
  {cmd: 'print', val: 1},
  {cmd: 'print', val: 2},
  {cmd: 'print', val: 3},
  {cmd: 'print', val: 4},
  {cmd: 'print', val: 5}
]).pipe(nanite)
