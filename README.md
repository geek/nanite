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
The example below can be found and ran in the [eg][] folder. It demonstrates how to use [Nanite - Drain][]
and [Nanite - Fill][] with the Nanite. Bear in mind though that this module can be used with any readable,
writeable, or transform streams as well as these two.

``` js
'use strict'

// create a new instance of nanite and take a
// copy of both the fill and drain builders.
var nanite = require('nanite')(),
    drain = require('nanite-drain'),
    fill = require('nanite-fill')

// set up a basic handler, this will be called
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
```

## API Overview

### Constructor
Requiring Nanite produces a builder function for creating Nanite instances. Each instance of Nanite
maintains it's own message stream which can be piped to or from and even together. Nanite also supports
a config object which allows you to change how Nanite processes messages.

``` js
var nanite = require('nanite')

var uiStream = nanite(),
    dataStream = nanite()

uiStream.pipe(dataStream)
        .pipe(uiStream)

```

#### Config
Nanite supports a number of options that change how each instance behaves. these are passed
as an object on instance creation.

``` js
var nanite = require('nanite')

var eventStream = nanite({multiMode: true})
var passthroughStream = nanite({passthrough: true})
```

##### multiMode: _true|false - default: false_
Allows multiple handlers to handle the same message. This behaviour essentially replicates
an eventing based model over a command based one.

##### passthrough: _true|false - default: false_
Allows messages to passed through to piped streams even if they have already been handled by
a subscribed handler. Needs to be enabled even if `multiMode` is set to true.

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

### .when(pattern, handler) : _handler_
A method for adding handlers and their patterns to Nanite. Any message satisfied by the provided
pattern will be passed to the provided handler. Any stream piped to .when() will be piped to
the handler itself and not Nanite. Messages passed to handlers are consumed by the handler unless
multiMode is set to true.

``` js
var nanite = require('nanite')(),
    drain = nanite.drain

nanite.when({cmd:'say-hello'}, drain(function (msg, done) {
   done()
}))
```

### .pin(pattern) : _wrapping function_
A method that returns a wrapping function. This allows patterns which are rather long or calculated
to be wrapped up for use later. To use, simply consume as a function, passing in a write stream or
transform.

``` js
var nanite = require('nanite')(),
    drain = nanite.drain

var handlerOne = nanite.pin({cmd: 'say-hello'})
var handlerTwo = nanite.pin({cmd: 'say-goodbye'})

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


### .remove(pattern) : _this_
A method for removing handlers and their patterns from Nanite.

``` js
var nanite = require('nanite')

nanite.when({cmd:'say-hello'}, into(msg, done) {
   done()
}))

nanite.when({cmd:'say-goodbye'}, into(msg, done) {
   done()
}))

nanite.remove({cmd:'say-hello'})
      .remove({cmd:'say-goodbye'})
```

## FAQ

#### Can I use Through2 or other stream do-da's with Nanite ?
Yes! Nanite itself is a simple transform and as such can be piped to and from. Handlers are added as
streams also as long as they are writeable or transforms they are compatible. Do note that anything
pushed to the read side of a transform is not passed to nanite, rather any direct pipe of the handler.
To add messages to nanite, pipe back to it or use .write().

#### Can I have multiple handlers for the same message ?
Yes! simply pass `{multiMode: true}` to the instance builder to get back a multiMode instance of nanite
that allows multiple handlers per message.

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
[eg]: ./eg/basic-usage.js

[travis-badge]: https://img.shields.io/travis/mcdonnelldean/nanite.svg?style=flat-square
[travis-url]: https://travis-ci.org/mcdonnelldean/nanite
[git-badge]: https://img.shields.io/github/release/mcdonnelldean/nanite.svg?style=flat-square
[git-url]: https://github.com/mcdonnelldean/nanite/releases
[npm-badge]: https://img.shields.io/npm/v/nanite.svg?style=flat-square
[npm-url]: https://npmjs.org/package/nanite

[patrun]: http://npm.im/patrun
[patrun repo]: https://github.com/rjrodger/patrun
[Patterns 101]: ./docs/nanite-101.md
[Nanite - Fill]: https://github.com/mcdonnelldean/nanite-fill
[Nanite - Drain]: https://github.com/mcdonnelldean/nanite-drain
