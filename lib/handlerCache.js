'use strict'

var pathrun = require('patrun')


function handleMany (pattern, data) {
  var items = this.find(pattern, true) || []
  items.push(data)

  return {
    find: function (args, data) {
      return 0 < items.length ? items : null
    },
    remove: function (args, data) {
      items.pop()
      return 0 == items.length;
    }
  }
}

function handleSingle (pattern, data) {
  return function (args, data) {
    return [data]
  }
}

module.exports = function (config) {
  if (config.multiMode === true) {
    return pathrun(handleMany)
  }

  return pathrun(handleSingle)
}
