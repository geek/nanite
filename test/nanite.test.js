'use strict'

var tape = require('tape'),
    nanite = require('../lib/nanite'),
    drain = nanite.drain,
    fill = nanite.fill

tape('Nanite works as expected', function (test) {
  var nan = nanite(),
      counter = 0

  test.plan(1)

  var handler = nan.handlerFor({cmd: 'test'})
  handler(drain(function (msg, done) {
    if (++counter === 2) test.pass()
    done()
  }))

  fill([
    {cmd: 'test'}
  ]).pipe(nan)

  nan.write({cmd: 'test'})
})
