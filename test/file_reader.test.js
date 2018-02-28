var test = require('tape');
var os = require('os');
var path = require('path');
var platform = os.platform();
var reader = require('../lib/file_reader.js');
var exec = require('child_process').exec;
var appDir = process.cwd();
var helpText = 'Usage:\n  mason-js install \n\n  or \n\n  mason-js install <package> <package type>\n\nDescription:\n  mason-js is a JS client for mason that installs c++ packages locally (both header-only and compiled). mason-js can install all packages declared in a mason-versions.ini file or it can install a single package. \n\nExample:\n  mason-js install  \n\n  OR\n\n  mason-js install protozero=1.5.1 --type=header \n\nOptions:\n  --type [header or compiled]\n';

var headerPackage = {
  name: 'protozero',
  version: '1.5.1',
  headers: true,
  os: '',
  awsPath: 'headers/protozero/1.5.1.tar.gz',
  src: 'https://s3.amazonaws.com/mason-binaries/headers/protozero/1.5.1.tar.gz',
  dst: appDir + '/mason_packages/headers/protozero/1.5.1'
};

var command_path = path.join(__dirname,'../bin/mason-js');

var system;

if (platform === 'darwin') {
  system = 'osx-x86_64';
} else if (platform === 'linux') {
  system = 'linux-x86_64';
}

var compiledPackage = {
  name: 'ccache',
  version: '3.6.4',
  headers: false,
  os: `${system}`,
  awsPath: `${system}/ccache/3.6.4.tar.gz`,
  src: `https://s3.amazonaws.com/mason-binaries/${system}/ccache/3.6.4.tar.gz`,
  dst: appDir + `/mason_packages/${system}/ccache/3.6.4`
};

test('reads ini file correctly', function(assert) {
  var masonPath = './test/fixtures/mason-versions.ini';

  reader.fileReader(masonPath, function(err, result) {
    assert.equal(result.length, 3);
    assert.deepEqual(result[0], headerPackage);
    assert.deepEqual(result[2], compiledPackage);
    assert.end();
  });
});

test('[package object] generates package object correctly', function(assert) {
  var p = 'protozero=1.5.1';
  var expected = {
    name: 'protozero', 
    version: '1.5.1'
  };

  var object = reader.generatePackageObject(p);
  assert.deepEqual(object, expected);
  assert.end();
});

test('[package object] invalid package', function(assert) {
  var p = 'protozero1.5.1';

  assert.throws(function(){
    reader.generatePackageObject(p);
  }, /Invalid package syntax/, 'Should throw syntax error');
  assert.end();
});


test('read incorrect ini file', function(assert) {
  var masonPath = './test/fixtures/wrong-order.ini';

  reader.fileReader(masonPath, function(err) {
    assert.equal(err.message, 'Headers must be declared before compiled packages.');
    assert.end();
  });
});

test('ini file does not exist', function(assert) {
  var masonPath = './test/fixtures/no-file.ini';
  var msg = 'ENOENT: no such file or directory, open \'./test/fixtures/no-file.ini\'';
  reader.fileReader(masonPath, function(err) {
    assert.equal(err.message, msg);
    assert.end();
  });
});

test('[mason-js] missing args', (assert) => {
  exec(command_path, (err, stdout, stderr) => {
    assert.ok(err);
    assert.equal(stdout, helpText, 'no stdout');
    assert.equal(stderr, 'missing mason-js args\n', 'expected args');
    assert.end();
  });
});

test('[mason-js] missing package type', (assert) => {
  exec(command_path + ' install protozero=1.5.1', (err, stdout, stderr) => {
    assert.ok(err);
    assert.equal(stdout, helpText, 'no stdout');
    assert.equal(stderr, 'include package type with package info: example protozero=1.5.1 --type=header\n', 'expected args');
    assert.end();
  });
});