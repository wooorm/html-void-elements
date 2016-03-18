/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module html-void-elements:script:build
 * @fileoverview Crawl the tables.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var cheerio = require('cheerio');
var bail = require('bail');
var list = require('..');

/*
 * Constants.
 */

var HTTPS = 'https://';

/*
 * Input / output locations.
 */

var w3c = 'http://w3c.github.io/html/syntax.html#void-elements';
var output = path.join(__dirname, '..', 'index.json');

/**
 * Load.
 *
 * @param {string} url - Resource to crawl.
 * @param {Function} callback - Invoked with document.
 */
function load(url, callback) {
    var lib = url.slice(0, HTTPS.length) === HTTPS ? https : http;

    lib.get(url, function (res, err) {
        var value = '';

        if (err) {
            return callback(err);
        }

        res
            .setEncoding('utf8')
            .on('data', function (buf) {
                value += buf;
            }).on('end', function () {
                return callback(null, value);
            });
    });
}

/*
 * Crawl W3C.
 */

load(w3c, function (err, doc) {
    if (err) {
        bail(err);
    }

    cheerio.load(doc)('#void-elements')
        .parent()
        .next()
        .find('code a')
        .each(function () {
            var data = this.children[0].data;

            if (data && list.indexOf(data) === -1) {
                list.push(data);
            }
        });

    fs.writeFile(output, JSON.stringify(list.sort(), 0, 2) + '\n', bail);
});
