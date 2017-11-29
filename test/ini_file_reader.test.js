var test = require('tape');
var fs = require('fs');
var os = require('os');
var platform = os.platform();
var sinon = require("sinon");
var pmock = require("pmock");
var FakeEnv = require('fake-env');
var fileReader = require('../lib/ini_file_reader.js');


test('reads ini file correctly', function(assert) {
  var masonPath = './test/fixtures/mason-versions.ini';

  var headerPackage = {'name':'protozero', 'version':'1.5.1', 'headers':true, 'os': null, 'awsPath': 'headers/protozero/1.5.1.tar.gz'}
  if ( platform === 'darwin'){
    var compiledPackage = { 'name': 'ccache', 'version': '3.6.4', 'headers': null, 'os': 'osx-x86_64', 'awsPath': 'osx-x86_64/ccache/3.6.4.tar.gz' }
  }else if(platform === 'linux'){
    var compiledPackage = { 'name': 'ccache', 'version': '3.6.4', 'headers': null, 'os': 'linux-x86_64', 'awsPath': 'linux-x86_64/ccache/3.6.4.tar.gz' }
  }

  fileReader(masonPath, function(err, result) {
    assert.deepEqual(result[0],headerPackage);
    assert.deepEqual(result[2], compiledPackage);
    assert.end()
  });
});

test('read incorrect ini file', function(assert) {
  var masonPath = './test/fixtures/wrong-order.ini';

  fileReader(masonPath, function(err, result) {
    assert.equal(err.message, 'Headers must be declared before compiled packages.');
    assert.end()
  });
});

test('ini file does not exist', function(assert) {
  var masonPath = './test/fixtures/no-file.ini';
  var msg = "ENOENT: no such file or directory, open './test/fixtures/no-file.ini'"
  fileReader(masonPath, function(err, result) {
    assert.equal(err.message, msg);
    assert.end()
  });
});









