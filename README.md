# Nanite
A pattern matching stream transform; Nanite is a simple node transform that runs in _object mode_. Anything
written to a Nanite instance is first pattern matched to see if a handler can be found, if not the message is handled, it is piped out of nanite, just like a regular transform.

___This module is experimental and brand new, it has no tests yet___

## Example
The example below demonstrates how to send data across two connected Nanite instances.

``` js
var nanite = require('../nanite')
var into = require('../into')

var streamOne = nanite()
var streamTwo = nanite()

streamTwo.write({cmd: 'say-hello'})
streamOne.write({cmd: 'say-goodbye'})

var handlerOne = streamOne.handlerFor({cmd: 'say-hello'})
var handlerTwo = streamTwo.handlerFor({cmd: 'say-goodbye'})

streamTwo.pipe(streamOne)
         .pipe(streamTwo)

handlerOne(into(function (msg, done) {
  console.log('Hi!')
  done()
}))

handlerTwo(into(function (msg, done) {
  console.log('Goodbye')
  done()
}))
```

As you can see, Nanite is nothing more than a standard transform meaning it can be piped to and from
It is important to note that messages not handled by handler will be piped out, this includes writes
before a handler is added.

## API Overview

### .handlers - _pathrun instance_
A [patrun][] instance that represents all of the handlers for a given instance of Nanite. Exposed
to allow the use of pathrun's internal commands which allow you to query and output the handler
tree in a variety of ways. See the [patrun repo][] for more information.

``` js
var nanite = require('nanite')
var allHandlers = nanite.handlers.list()
```

### .write() - _void_
A method for writing new values to a given Nanite instances. No matter where a value is written it
always starts at the top of the stream and works its way down.

``` js
var nanite = require('../nanite')()
var into = require('../into')

var handlerOne = nanite.handlerFor({cmd: 'say-hello'})
var handlerTwo = nanite.handlerFor({cmd: 'say-goodbye'})

handlerOne(into(function (msg, done) {
  console.log('Hi!')
  nanite.write({cmd: 'say-goodbye'})
  done()
}))

handlerTwo(into(function (msg, done) {
  console.log('Goodbye')
  done()
}))

nanite.write({cmd: 'say-hello'})
```


### .addHandler(pattern, stream) - _returns: handler_
A method for adding handlers and their patterns to Nanite. Any message satisfied by the provided
pattern will be passed to the provided handler. For more info on patterns see our [Patterns 101][]
guide.

``` js
var nanite = require('nanite')

natite.addHandler({cmd:'say-hello'}, into(msg, done) {
   done()
}))
```

### .removeHandler(pattern) - _returns: this_
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

### .handlerFor(pattern) - _returns: wrapping function_
A method that returns a wrapping function. This allows patterns which are rather long or calculated
to be wrapped up for use later. To use, simply consume as a function, passing in a write stream or
transform.

``` js
var nanite = require('../nanite')()
var into = require('../into')

var handlerOne = nanite.handlerFor({cmd: 'say-hello'})
var handlerTwo = nanite.handlerFor({cmd: 'say-goodbye'})

handlerOne(into(function (msg, done) {
  console.log('Hi!')
  done()
}))

handlerTwo(into(function (msg, done) {
  console.log('Goodbye')
  done()
}))

nanite.write({cmd: 'say-hello'})
nanite.write({cmd: 'say-goodbye'})
```


### .removeHandler(pattern) - _returns: this_
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

[patrun]: http://npm.im/patrun
[patrun repo]: https://github.com/rjrodger/patrun
[Patterns 101]: ./docs/nanite-101.md
