'use strict'

// get the nanite builder function and take a
// copy of both the fill and drain functions.
var nanite = require('../lib/nanite'),
    drain = require('nanite-drain'),
    fill = require('nanite-fill')

// we can have multiple individual
// instances of nanite at any given time.
var helloStream = nanite(),
    goodbyeStream = nanite()

// because each instance is a transform
// they are duplex and can be piped together.
goodbyeStream.pipe(helloStream)
             .pipe(goodbyeStream)

// create handler functions for use later.
var handleHello = helloStream.pin({cmd: 'say-hello'}),
    handleGoodbye = goodbyeStream.pin({cmd: 'say-goodbye'})

// using drain keeps handlers neat and tidy.
handleHello(drain(function (msg, done) {
  console.log('Hello!')
  done()
}))

// handlers can accept any readable or transform
// based stream.
handleGoodbye(drain(function (msg, done) {
  console.log('Goodbye')
  done()
}))

// write a message to each stream, notice
// the handlers are on the opposite stream
// but because they are piped together the
// messages get through.
goodbyeStream.write({cmd: 'say-hello'})
helloStream.write({cmd: 'say-goodbye'})
