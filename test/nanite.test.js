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

tape('passthrough: false - disallows passthrough if msg was handled', function (test) {
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

tape('passthrough: true - allows passthrough even if msg was handled', function (test) {
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

tape('multiMode: true - allows multiple handlers per msg', function (test) {
  test.plan(2)

  var nanite = Nanite({multiMode: true})

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

tape('multiMode: false - disallows multiple handlers per msg', function (test) {
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

tape('.remove(pattern) removes all handlers', function (test) {
  test.plan(2)

  var nanite = Nanite({multiMode: true})

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.when({cmd: 'test'}, drain(function (msg, done) {
    test.pass()
    done()
  }))

  nanite.write({cmd: 'test'})
  nanite.remove({cmd: 'test'})
  nanite.write({cmd: 'test'})
})

tape('.remove(pattern, payload)', function (test) {
  test.plan(4)

  var nanite = Nanite({multiMode: true})

  var payloadOne = drain(function (msg, done) {
    test.pass()
    done()
  })

  var payloadTwo = drain(function (msg, done) {
    test.pass()
    done()
  })

  nanite.when({cmd: 'test'}, payloadOne)
  nanite.when({cmd: 'test'}, payloadTwo)

  nanite.write({cmd: 'test'})
  nanite.write({cmd: 'test'})
})

tape('.remove(pattern, payload) removes handler with matching payload', function (test) {
  test.plan(3)

  var nanite = Nanite({multiMode: true})

  var payloadOne = drain(function (msg, done) {
    test.pass()
    done()
  })

  var payloadTwo = drain(function (msg, done) {
    test.pass()
    done()
  })

  nanite.when({cmd: 'test'}, payloadOne)
  nanite.when({cmd: 'test'}, payloadTwo)

  nanite.write({cmd: 'test'})
  nanite.remove({cmd: 'test'}, payloadOne)
  nanite.write({cmd: 'test'})
})
