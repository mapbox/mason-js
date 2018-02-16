var test = require('tape');
var fs = require('fs');
var os = require('os');
var platform = os.platform();
var sinon = require("sinon");
var FakeEnv = require('fake-env');
var reader = require('../lib/ini_file_reader.js');
var url = require('url');
var exec = require('child_process').exec;

var helpText = 'Usage:\n  mason-js install \n\n  or \n\n  mason-js install <package> <package type>\n\nDescription:\n  mason-js is a JS client for mason that installs c++ packages locally (both header-only and compiled). mason-js can install all packages declared in a mason-versions.ini file or it can install a single package. \n\nExample:\n  mason-js install  \n\n  OR\n\n  mason-js install protozero=1.5.1 --type=header \n\nOptions:\n  --type [header or compiled]\n'

var headerPackage = { name: 'protozero', 
  version: '1.5.1', 
  headers: true, 
  os: null, 
  awsPath: 'headers/protozero/1.5.1.tar.gz', 
  src: 'https://s3.amazonaws.com/mason-binaries/headers/protozero/1.5.1.tar.gz', 
  dst: '/Users/annmillspaugh/mapbox/mason-js/mason_packages/headers/protozero/1.5.1' 
}

if ( platform === 'darwin'){
  var compiledPackage = { name: 'ccache', 
    version: '3.6.4', headers: null, 
    os: 'osx-x86_64', 
    awsPath: 'osx-x86_64/ccache/3.6.4.tar.gz', 
    src: 'https://s3.amazonaws.com/mason-binaries/osx-x86_64/ccache/3.6.4.tar.gz', 
    dst: '/Users/annmillspaugh/mapbox/mason-js/mason_packages/osx-x86_64/ccache/3.6.4' 
  }
}else if(platform === 'linux'){
  var compiledPackage = { name: 'ccache', 
    version: '3.6.4', headers: null, 
    os: 'linux-x86_64', 
    awsPath: 'linux-x86_64/ccache/3.6.4.tar.gz', 
    src: 'https://s3.amazonaws.com/mason-binaries/linux-x86_64/ccache/3.6.4.tar.gz', 
    dst: '/Users/annmillspaugh/mapbox/mason-js/mason_packages/linux-x86_64/ccache/3.6.4' 
  }  
}

test('reads ini file correctly', function(assert) {
  var masonPath = './test/fixtures/mason-versions.ini';

  reader.fileReader(masonPath, function(err, result) {
    assert.deepEqual(result[0],headerPackage);
    assert.deepEqual(result[2], compiledPackage);
    assert.end()
  });
});

test('read incorrect ini file', function(assert) {
  var masonPath = './test/fixtures/wrong-order.ini';

  reader.fileReader(masonPath, function(err, result) {
    assert.equal(err.message, 'Headers must be declared before compiled packages.');
    assert.end()
  });
});

test('ini file does not exist', function(assert) {
  var masonPath = './test/fixtures/no-file.ini';
  var msg = "ENOENT: no such file or directory, open './test/fixtures/no-file.ini'"
  reader.fileReader(masonPath, function(err, result) {
    assert.equal(err.message, msg);
    assert.end()
  });
});

test('build params returns correct package object with cli args', function(assert) {
  var masonPath = './test/fixtures/no-file.ini';
  var msg = "ENOENT: no such file or directory, open './test/fixtures/no-file.ini'"
  var package = reader.buildParams('protozero=1.5.1'); 
  
  assert.deepEqual(package[0], headerPackage);
  assert.end();
});

test('[mason-js] missing args', (assert) => {
  exec('mason-js', (err, stdout, stderr) => {
    assert.ok(err);
    assert.equal(stdout, helpText, 'no stdout');
    assert.equal(stderr, 'missing mason-js args\n', 'expected args');
    assert.end();
  });
});

test('[mason-js] missing args', (assert) => {
  exec('mason-js install protozero=1.5.1', (err, stdout, stderr) => {
    assert.ok(err);
    assert.equal(stdout, helpText, 'no stdout');
    assert.equal(stderr, 'include package type with package info: example protozero=1.5.1 --type=header\n', 'expected args');
    assert.end();
  });
});

