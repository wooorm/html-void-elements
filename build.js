'use strict';

var fs = require('fs');
var https = require('https');
var concat = require('concat-stream');
var unified = require('unified');
var html = require('rehype-parse');
var q = require('hast-util-select');
var toString = require('hast-util-to-string');
var bail = require('bail');
var list = require('.');

https.get('https://html.spec.whatwg.org/multipage/syntax.html#elements-2', function (res) {
  res.pipe(concat(onconcat)).on('error', bail);

  function onconcat(buf) {
    var dl = q.select('#elements-2 ~ dl dd', unified().use(html).parse(buf));

    q.selectAll('code', dl).forEach(each);

    fs.writeFile('index.json', JSON.stringify(list.sort(), 0, 2) + '\n', bail);

    function each(node) {
      var data = toString(node);

      if (data && !/\s/.test(data) && list.indexOf(data) === -1) {
        list.push(data);
      }
    }
  }
});
