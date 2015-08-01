# Nanite
[![travis][travis-badge]][travis-url]
[![git][git-badge]][git-url]
[![npm][npm-badge]][npm-url]

A pattern matching stream transform; Nanite is a simple node steam transform that runs in _object mode_.
Anything written to a Nanite instance is first pattern matched to see if a handler can be found. If
the message is not handled, it is piped out of Nanite, just like a regular transform.

## Installation
To install Nanite, simply use npm:

```
npm install nanite --save
```

## Usage
The example below can be found and ran from the [eg][] folder; it demonstrates how to use Nanite
and some of it's additional functionality.

``` js
'use strict'

// create a new instance of nanite and take a
// copy of both the fill and drain functions.
var nanite = require('../lib/nanite')(),
    fill = nanite.fill,
    drain = nanite.drain

// set up a basic handler, this should be called
// as many times as there are objects passed to fill.
var handlePrint = nanite.handlerFor({cmd: 'print'})

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
```

## API Overview

### Constructor
Requiring Nanite produces a builder function for creating Nanite instances. Each instance of Nanite
maintains it's own message stream which can be piped to or from and even together.

Nanite has two stream builders available for both readable (Fill) and writeable (Drain). Both .drain
and .fill are available on the nanite builder function as well as individual Nanite instances.

``` js
var nanite = require('nanite')

var uiStream = nanite(),
    dataStream = nanite()

uiStream.pipe(dataStream)
        .pipe(uiStream)

```

### .fill
A field containing a builder function for creating instances of Fill. Fill is a readable stream
that takes an array of objects and pumps them to any piped writable or transform streams. Fill is a
standard readable stream and as such can be used outside of Nanite and piped to standard writeable
or transform streams.

``` js
var nanite = require('nanite')(),
    fill = nanite.fill

fill([
  {cmd:'attack'},
  {cmd: 'run away'}
]).pipe(nanite)
```

### .drain
A field containing a builder function for creating instances of Drain. Drain is a writeable stream
that takes a function for processing messages piped to it. Use in conjunction with handler creation
for convenient message processing. Drain is a standard writeable stream and as such can be used
outside of Nanite and piped to standard readable or transform streams.

``` js
var nanite = require('nanite')(),
    drain = nanite.drain

nanite.pipe(drain(function (msg, done) {

}))
```

### .handlers
A [patrun][] instance that represents all of the handlers for a given instance of Nanite. Exposed
to allow the use of pathrun's internal commands which allow you to query and output the handler
tree in a variety of ways. See the [patrun repo][] for more information.

``` js
var nanite = require('nanite')(),
    handlers = nanite.handlers

console.log(handler.list())
```

### .write(msg) : _bool_
A method for writing new values to a given Nanite instance. No matter when a value is written it
always starts at the top of the stream and works its way down. Nanite's .write() is the standard
non modified .write() for a transform stream.

``` js
var nanite = require('nanite')()

nanite.write({cmd: 'toggle-menu'})
nanite.write({id: '1234', user: 'Jane Doe'})
```

### .addHandler(pattern, handler) : _handler_
A method for adding handlers and their patterns to Nanite. Any message satisfied by the provided
pattern will be passed to the provided handler. Any stream piped to .addHandler() will be piped to
the handler itself and not Nanite. Messages passed to handlers are consumed by the handler and not
sent any further down stream.

``` js
var nanite = require('nanite')(),
    drain = nanite.drain

natite.addHandler({cmd:'say-hello'}, drain(function (msg, done) {
   done()
}))
```

### .removeHandler(pattern) : _this_
A method for removing handlers and their patterns from Nanite.

``` js
var nanite = require('nanite')(),
    drain = nanite.drain

natite.addHandler({cmd:'say-hello'}, drain(function (msg, done) {
   done()
}))

natite.addHandler({cmd:'say-goodbye'}, drain(function (msg, done) {
   done()
}))

nanite.removeHandler({cmd:'say-hello'})
      .removeHandler({cmd:'say-goodbye'})
```

### .handlerFor(pattern) : _wrapping function_
A method that returns a wrapping function. This allows patterns which are rather long or calculated
to be wrapped up for use later. To use, simply consume as a function, passing in a write stream or
transform.

``` js
var nanite = require('nanite')(),
    drain = nanite.drain

var handlerOne = nanite.handlerFor({cmd: 'say-hello'})
var handlerTwo = nanite.handlerFor({cmd: 'say-goodbye'})

handlerOne(drain(function (msg, done) {
  console.log('Hi!')
  done()
}))

handlerTwo(drain(function (msg, done) {
  console.log('Goodbye')
  done()
}))

nanite.write({cmd: 'say-hello'})
nanite.write({cmd: 'say-goodbye'})
```


### .removeHandler(pattern) : _this_
A method for removing handlers and their patterns from Nanite.

``` js
var nanite = require('nanite')

natite.addHandler({cmd:'say-hello'}, into(msg, done) {
   done()
}))

natite.addHandler({cmd:'say-goodbye'}, into(msg, done) {
   done()
}))

nanite.removeHandler({cmd:'say-hello'})
      .removeHandler({cmd:'say-goodbye'})
```

## FAQ

#### Can I use Through2 or other stream do-da's with Nanite ?
Yes! Nanite itself is a simple transform and as such can be piped to and from. Handlers are added as
streams also as long as they are writeable or transforms they are compatible. Do note that anything
pushed to the read side of a transform is not passed to nanite, rather any direct pipe of the handler.
To add messages to nanite, pipe back to it or use .write().

#### Can I have multiple handlers for the same message ?
No. A only a single handler for a given pattern is ever stored on a last in basis.

#### Does Nanite work in the browser ?
Yes! Nanite is and will always be usable in the browser. You will need to use webpack or browserify
to create a browser copy. Later, a distribution version will be provided.

#### What are the pattern rules ?
See [patrun][] for a full look at how patterns work in detail.

#### Can I swap out .handlers  patrun instance with my own custom version ?
Yes, as long as it is done before you begin processing messages this should be fine. Pattern rules
are inforced via patrun, swapping it out gives you the ability to futher modify Nanite

## Contributing
Nanite is an __open project__ and encourages participation. If you feel you can help in any way, be
it with examples, extra testing, or new features please be our guest.

_See our [Contribution Guide][] for information on obtaining the source and an overview of the
tooling used._

## License

Copyright Dean McDonnell 2015, Licensed under [MIT][].

[MIT]: ./LICENSE
[Contribution Guide]: ./CONTRIBUTING.md
[eg]: ./eg/using-fill-and-drain.js

[travis-badge]: https://img.shields.io/travis/mcdonnelldean/nanite.svg?style=flat-square
[travis-url]: https://travis-ci.org/mcdonnelldean/nanite
[git-badge]: https://img.shields.io/github/release/mcdonnelldean/nanite.svg?style=flat-square
[git-url]: https://github.com/mcdonnelldean/nanite/releases
[npm-badge]: https://img.shields.io/npm/v/nanite.svg?style=flat-square
[npm-url]: https://npmjs.org/package/nanite

[patrun]: http://npm.im/patrun
[patrun repo]: https://github.com/rjrodger/patrun
[Patterns 101]: ./docs/nanite-101.md
