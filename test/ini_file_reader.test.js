var test = require('tape');
var fs = require('fs');
var fileReaderPromise = require('../lib/ini_file_reader.js');

var os = require('os');
var platform = os.platform();
var sinon = require("sinon");
var pmock = require("pmock");
var FakeEnv = require('fake-env');

// process.env.TEST = true; 

test('read ini file', function(assert) {
  var p = './test/fixtures/mason-versions.ini';

  const env = new FakeEnv({
    MASON_INI_PATH: p
  });

  var headerPackage = {'name':'protozero', 'version':'1.5.1', 'headers':true, 'os': null, 'awsPath': 'headers/protozero/1.5.1.tar.gz'}
  if ( platform === 'darwin'){
    var compiledPackage = { 'name': 'ccache', 'version': '3.6.4', 'headers': null, 'os': 'osx-x86_64', 'awsPath': 'osx-x86_64/ccache/3.6.4.tar.gz' }
  }else if(platform === 'linux'){
    var compiledPackage = { 'name': 'ccache', 'version': '3.6.4', 'headers': null, 'os': 'linux-x86_64', 'awsPath': 'linux-x86_64/ccache/3.6.4.tar.gz' }
  }
  console.log('path');
  console.log(process.env.MASON_INI_PATH);

  fileReaderPromise.then(function(result) {
    assert.deepEqual(result[0],headerPackage);
    assert.deepEqual(result[2], compiledPackage);
    env.restore();

    assert.end()
  });
});

test('ini file wrong order', function(assert) {
  // file doesn't exist
  var testPath = './test/fixtures/wrong-order.ini';

  const env = new FakeEnv({
    MASON_INI_PATH: testPath
  });

  console.log(process.env.MASON_INI_PATH);
  assert.equal(process.env.MASON_INI_PATH, './test/fixtures/wrong-order.ini', 'ooooh its been mocked!');

  fileReaderPromise.then(function(result) {
    assert.raise(result, 'You must declare headers first');
    console.log(result);
    env.restore();
    assert.equal(process.env.MASON_INI_PATH, './test/fixtures/mason-versions.ini', 'restored');
    assert.end()
  })
});

// test('incorrect package order in ini file', function(assert) {
//   // file doesn't exist
//   var testPath = './test/fixtures/wrong-order.ini';
//   // var stub = sinon.stub("process.env.MASON_INI_PATH");
//   // stub.returns(testPath);
//   var morph = require('mock-env').morph;
 

//   // stub(process.env.MASON_INI_PATH);
//   // require("sinon").sandbox.create().stub(process.env, "MASON_INI_PATH").callsFake(testPath);
//   // test('setup', function(t){
//   //   process.env.MASON_INI_PATH = testPath;
//   // });

//   console.log(process.env.MASON_INI_PATH);
//   fileReaderPromise.then(function(result) {
//     var result = morph(function() {
//         return process.env['MASON_INI_PATH'];
//     }, {
//         MASON_INI_PATH: testPath
//     });
//     console.log(process.env.MASON_INI_PATH);

//     t.equal(fs.existsSync(testPath), false);
//     console.log(result);
//     assert.end()
//   })

//   // test('teardown', function(t){
//   //   process.env.MASON_INI_PATH = '';
//   // });
// });


// test('ini file does not exist', function(assert) {
//   let originalPath = process.env.MASON_INI_PATH;
//   // file doesn't exist
//   let testPath = './test/test-versions.ini';

//   test('setup', function(t){
//     fs.unlinkSync(originalPath); 
//   });

  
//   fileReaderPromise.then(function(err, result) {
//     assert.equal(fs.existsSync(originalPath), false);
//     assert.error(err);
//     assert.end()
//   });

//   test('teardown', function(t){
//     fs.createReadStream(testPath).pipe(fs.createWriteStream(originalPath));
//   });
// });



