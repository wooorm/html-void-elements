import fs from 'fs'
import https from 'https'
import concat from 'concat-stream'
import unified from 'unified'
import html from 'rehype-parse'
// @ts-ignore
import q from 'hast-util-select'
// @ts-ignore
import toString from 'hast-util-to-string'
import {bail} from 'bail'
import {htmlVoidElements} from './index.js'

var proc = unified().use(html)

https.get('https://html.spec.whatwg.org/multipage/syntax.html', onconnection)

/**
 * @param {import('http').IncomingMessage} response
 */
function onconnection(response) {
  response.pipe(concat(onconcat)).on('error', bail)
}

/**
 * @param {Buffer} buf
 */
function onconcat(buf) {
  var dl = q.select('#elements-2 ~ dl dd', proc.parse(buf))
  var nodes = q.selectAll('code', dl)
  var index = -1
  /** @type {string} */
  var value

  while (++index < nodes.length) {
    value = toString(nodes[index])

    if (value && !/\s/.test(value) && !htmlVoidElements.includes(value)) {
      htmlVoidElements.push(value)
    }
  }

  fs.writeFile(
    'index.js',
    'export var htmlVoidElements = ' +
      JSON.stringify(htmlVoidElements.sort(), null, 2) +
      '\n',
    bail
  )
}
