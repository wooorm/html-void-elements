import fs from 'node:fs'
import https from 'node:https'
import concat from 'concat-stream'
import {unified} from 'unified'
import html from 'rehype-parse'
import {select, selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {bail} from 'bail'
import {htmlVoidElements} from './index.js'

const proc = unified().use(html)

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
  const dl = select('#elements-2 ~ dl dd', proc.parse(buf))
  const nodes = selectAll('code', dl)
  let index = -1
  /** @type {string} */
  let value

  while (++index < nodes.length) {
    value = toString(nodes[index])

    if (value && !/\s/.test(value) && !htmlVoidElements.includes(value)) {
      htmlVoidElements.push(value)
    }
  }

  fs.writeFile(
    'index.js',
    'export const htmlVoidElements = ' +
      JSON.stringify(htmlVoidElements.sort(), null, 2) +
      '\n',
    bail
  )
}
