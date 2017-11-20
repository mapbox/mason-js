var test = require('tape');
var fileReaderPromise = require('../lib/ini_file_reader.js');
const fs = require('fs');
const dotenvConfig = require('../config.js');
dotenvConfig.envConfig();


test('read ini file', function(assert) {
  var headerPackage = {'name':'protozero', 'version':'1.5.1', 'headers':true, 'os': null, 'awsPath': 'headers/protozero/1.5.1.tar.gz'}
  var compiledPackage = { 'name': 'ccache', 'version': '3.6.4', 'headers': null, 'os': 'osx-x86_64', 'awsPath': 'osx-x86_64/ccache/3.6.4.tar.gz' }

  fileReaderPromise.then(function(result) {
    assert.deepEqual(result[0],headerPackage);
    assert.deepEqual(result[2], compiledPackage);
    assert.end()
  });
});

// test('ini file does not exist', function(assert) {
//   let originalPath = process.env.MASON_INI_PATH;
//   let testPath = './test/mason-test-versions.ini';
//   console.log(originalPath); 
//   fs.unlinkSync(originalPath); 
//   fileReaderPromise.then(function(result) {
//     console.log(result);
//     assert.end()
//   });
//   fs.createReadStream(testPath).pipe(fs.createWriteStream(originalPath));
// });



