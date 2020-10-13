'use strict'

var test = require('tape')
var htmlVoidElements = require('.')

test('htmlVoidElements', function (t) {
  t.ok(Array.isArray(htmlVoidElements), 'should be an `array`')

  htmlVoidElements.forEach(function (tagName) {
    t.equal(typeof tagName, 'string', '`' + tagName + '` should be a string')
  })

  t.end()
})
