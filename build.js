import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import {fromHtml} from 'hast-util-from-html'
import {select, selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {htmlVoidElements} from './index.js'

const response = await fetch(
  'https://html.spec.whatwg.org/multipage/syntax.html'
)
const text = await response.text()
const tree = fromHtml(text)

const dd = select('#elements-2 ~ dl dd', tree)
assert(dd, 'expected a `dd`')
const nodes = selectAll('code', dd)
let index = -1

while (++index < nodes.length) {
  const value = toString(nodes[index])

  if (value && !/\s/.test(value) && !htmlVoidElements.includes(value)) {
    htmlVoidElements.push(value)
  }
}

const list = [...new Set(htmlVoidElements)].sort()

await fs.writeFile(
  'index.js',
  [
    '/**',
    ' * List of HTML void tag names.',
    ' *',
    ' * @type {Array<string>}',
    ' */',
    'export const htmlVoidElements = ' + JSON.stringify(list, null, 2),
    ''
  ].join('\n')
)
