import test from 'tape'
import {htmlVoidElements} from './index.js'

test('htmlVoidElements', function (t) {
  var index = -1

  t.ok(Array.isArray(htmlVoidElements), 'should be an `array`')

  while (++index < htmlVoidElements.length) {
    t.equal(
      typeof htmlVoidElements[index],
      'string',
      '`' + htmlVoidElements[index] + '` should be a string'
    )
  }

  t.end()
})
