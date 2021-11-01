import assert from 'node:assert'
import fs from 'node:fs'
import https from 'node:https'
import concatStream from 'concat-stream'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import {select, selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {bail} from 'bail'
import {htmlVoidElements} from './index.js'

const processor = unified().use(rehypeParse)

https.get('https://html.spec.whatwg.org/multipage/syntax.html', (response) => {
  response
    .pipe(
      concatStream((buf) => {
        const dd = select('#elements-2 ~ dl dd', processor.parse(buf))
        assert(dd, 'expected a `dd`')
        const nodes = selectAll('code', dd)
        let index = -1

        while (++index < nodes.length) {
          const value = toString(nodes[index])

          if (value && !/\s/.test(value) && !htmlVoidElements.includes(value)) {
            htmlVoidElements.push(value)
          }
        }

        fs.writeFile(
          'index.js',
          [
            '/**',
            ' * List of HTML void tag names.',
            ' *',
            ' * @type {Array<string>}',
            ' */',
            'export const htmlVoidElements = ' +
              JSON.stringify(htmlVoidElements.sort(), null, 2),
            ''
          ].join('\n'),
          bail
        )
      })
    )
    .on('error', bail)
})
