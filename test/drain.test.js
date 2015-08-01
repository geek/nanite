'use strict'

var tape = require('tape'),
    nanite = require('../lib/nanite')(),
    fill = nanite.fill

tape('Drain drains as expected', function (test) {
  var drain = nanite.drain

  test.plan(1)

  nanite.addHandler({msg: 'test'}, drain(function (msg, done) {
    test.pass()
  }))

  fill([
    {msg: 'test'},
    {msg: 'test'}
  ]).pipe(nanite)
})
