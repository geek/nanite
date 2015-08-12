'use strict'

var tape = require('tape'),
    Nanite = require('../lib/nanite'),
    drain = require('nanite-drain'),
    fill = require('nanite-fill')

tape('Can be piped from', function (test) {
  test.plan(1)

  var nanite = Nanite()

  nanite.pipe(drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.write({cmd: 'test'})
})

tape('Can be piped to', function (test) {
  test.plan(1)

  var nanite = Nanite()

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  fill([
    {cmd: 'test'}
  ]).pipe(nanite)
})

tape('by default disallows passthrough if msg was handled', function (test) {
  test.plan(1)

  var nanite = Nanite()

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.pipe(drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.write({cmd: 'test'})
})

tape('by default disallows multiple handlers per msg', function (test) {
  test.plan(1)

  var nanite = Nanite()

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.write({cmd: 'test'})
})

tape('passthrough: true allows passthrough even if msg was handled', function (test) {
  test.plan(2)

  var nanite = Nanite({passthrough: true})

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.pipe(drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.write({cmd: 'test'})
})

tape('multiMode: true allows multiple handlers per msg', function (test) {
  var nanite = Nanite({multiMode: true})

  test.plan(2)

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.write({cmd: 'test'})
})
