/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module html-void-elements
 * @fileoverview Test suite for `html-void-elements`.
 */

'use strict';

/* eslint-env node */

/* Module dependencies. */
var test = require('tape');
var htmlVoidElements = require('./index.js');

/* Tests. */
test('htmlVoidElements', function (t) {
  t.ok(
    Array.isArray(htmlVoidElements),
    'should be an `array`'
  );

  htmlVoidElements.forEach(function (tagName) {
    t.equal(
      typeof tagName,
      'string',
      '`' + tagName + '` should be a string'
    );
  });

  t.end();
});
