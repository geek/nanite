'use strict'

// create a new instance of nanite and
// take a copy of the drain function.
var nanite = require('../lib/nanite')(),
    drain = nanite.drain

// .handleFor allows you to wrap a pattern in a named function
// that you can pass a writeable or transform to later.
var handleHello = nanite.handlerFor({say: 'Hello'}),
    handleWorld = nanite.handlerFor({say: 'World'})

// in our case we are using the build in writable function,
// drain. Which will remove the message from the stream for
// processing.
handleHello(drain(function (msg, done) {
  console.log(msg.say)
  done()
}))

// named handlers offer much better readability when
// patterns become too large or require calculation.
handleWorld(drain(function (msg, done) {
  console.log(msg.say + '!')
  done()
}))

// lets fire both handlers.
nanite.write({say: 'Hello'})
nanite.write({say: 'World'})
