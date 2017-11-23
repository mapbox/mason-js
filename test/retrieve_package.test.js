var test = require('tape');
var loader = require('../lib/retrieve_package.js');
var fs = require('fs');
var dotenvConfig = require('../config.js');
dotenvConfig.envConfig();
var path = require('path');
var sinon = require('sinon');
var request = require('request');

global.appRoot = process.cwd();

test('places binaries correctly', function(assert) {
  // var src = path.join(global.appRoot, 'test', 'fixtures', 'protozero1.5.1.tar.gz');
  // var dst = path.join(global.appRoot, 'test', 'dst');
  var url = 'https://s3.amazonaws.com/mason-binaries/headers/protozero/1.5.6.tar.gz';

  sinon.stub(request, 'get').yields(null, {statusCode: 200}, 'foo');       

  loader.download(url, function(err, result) {
    console.log(err);
    console.log(result);
    assert.end()
  });
});

// test('MASON_BUCKET not set', function(assert) {
//   var masonPath = './test/fixtures/mason-versions.ini';
//   var msg = 'You must set MASON_BUCKET as an environment variable.';
//   loader.install(masonPath, function(err, result) {
//     console.log(result);
//     assert.equal(err.message, msg);
//     assert.end()
//   });
// });