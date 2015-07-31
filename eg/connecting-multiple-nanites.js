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
