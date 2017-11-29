var test = require('tape');
var loader = require('../lib/retrieve_package.js');
var fs = require('fs');
var dotenvConfig = require('../config.js');
dotenvConfig.envConfig();
var path = require('path');
var sinon = require('sinon');
var request = require('request');
const nock = require('nock');
const https = require('https');
const util = require('util');

global.appRoot = process.cwd();

test('places binaries correctly', function(assert) {
  var url = 'https://s3.amazonaws.com/mason-binaries/headers/protozero/1.5.6.tar.gz';

  // var expected = [{id: 'test-id' }, {id: 'test-id-two'}];
  // var s = sinon.spy(request, 'get');

  sinon.stub(request, 'get').yields({statusCode: 200});
  // sinon.stub(request, 'get').yields(null, {statusCode: 200}, 'foo');       
  // var callback = sinon.spy();
      //We can use a spy as the callback so it's easy to verify

  loader.download(url, function(err, result){
    // console.log(result, null, 2);
    assert.equal(request.get.called);
    // console.log(JSON.stringify(result, null, 2));
    // console.log(util.inspect(result, true, null))

    // console.log(r.firstCall.args);
    // assert.equal(r.firstCall.args[0].url, url);
    // console.log(s.callCount);

    assert.end()
  });
  // sinon.assert.calledOnce(callback);



  // loader.install(url, function(err, result) {
  //   var setNameSpy = sinon.spy(loader, 'place_binary');
  //   console.log(err);
  //   console.log('callcount')
  //   console.log(setNameSpy.callCount);

  //   // console.log(err);
  //   // console.log(result);
  //   assert.end()
  // });
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