'use strict'

var tape = require('tape'),
    nanite = require('../lib/nanite')(),
    drain = nanite.drain

tape('Fill fills as expected', function (test) {
  var fill = nanite.fill

  test.plan(1)

  nanite.addHandler({msg: 'test'}, drain(function (msg, done) {
    test.pass()
  }))

  fill([
    {msg: 'test'},
    {msg: 'test'}
  ]).pipe(nanite)
})
