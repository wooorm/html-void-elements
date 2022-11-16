import assert from 'node:assert/strict'
import test from 'node:test'
import {htmlVoidElements} from './index.js'

test('htmlVoidElements', function () {
  let index = -1

  assert.ok(Array.isArray(htmlVoidElements), 'should be an `array`')

  while (++index < htmlVoidElements.length) {
    assert.equal(
      typeof htmlVoidElements[index],
      'string',
      '`' + htmlVoidElements[index] + '` should be a string'
    )
  }
})
