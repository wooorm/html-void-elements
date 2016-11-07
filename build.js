'use strict';

var fs = require('fs');
var jsdom = require('jsdom');
var bail = require('bail');
var list = require('./');

jsdom.env('http://w3c.github.io/html/syntax.html#void-elements', function (err, window) {
  bail(err);

  var dfn = window.document.getElementById('void-elements');
  var dd = dfn.parentNode.nextElementSibling;
  var rows = [].slice.call(dd.querySelectorAll('code a'));

  rows.forEach(function (row) {
    var data = row.textContent;

    if (data && !/\s/.test(data) && list.indexOf(data) === -1) {
      list.push(data);
    }
  });

  fs.writeFile('index.json', JSON.stringify(list.sort(), 0, 2) + '\n', bail);
});
