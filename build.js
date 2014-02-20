'use strict';

var assert = require('assert');
var fs = require('fs');

var step = require('testit');
var npm = require('npm-fetch');
var unpack = require('tar-pack').unpack;
var mkdirp = require('mkdirp').sync;
var rimraf = require('rimraf').sync;

step('cleanup', function () {
  rimraf(__dirname + '/temp');
  rimraf(__dirname + '/theme');
  rimraf(__dirname + '/print');
  rimraf(__dirname + '/index.js');
  rimraf(__dirname + '/index.css');
});

step('download', function (callback) {
  npm('reveal', 'hakimel/reveal.js#2.6.1').pipe(unpack(__dirname + '/temp', callback));
}, '60 seconds');

step('move css', function () {
  mkdirp(__dirname + '/print');
  mkdirp(__dirname + '/theme');
  fs.renameSync(__dirname + '/temp/css/reveal.css', __dirname + '/index.css');
  fs.renameSync(__dirname + '/temp/css/print/paper.css', __dirname + '/print/paper.css');
  fs.renameSync(__dirname + '/temp/css/print/pdf.css', __dirname + '/print/pdf.css');
  fs.readdirSync(__dirname + '/temp/css/theme').filter(function (theme) {
    return /\.css$/.test(theme);
  }).forEach(function (theme) {
    fs.renameSync(__dirname + '/temp/css/theme/' + theme, __dirname + '/theme/' + theme);
  });
});

step('move js', function () {
  var js = fs.readFileSync(__dirname + '/temp/js/reveal.js', 'utf8');
  js += '\nmodule.exports = Reveal;';
  fs.writeFileSync(__dirname + '/index.js', js);
});

step('cleanup', function () {
  rimraf(__dirname + '/temp');
});