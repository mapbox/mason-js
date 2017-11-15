var test = require('tape');
var fileReaderPromise = require('../lib/ini_file_reader.js');
const fs = require('fs');
const dotenvConfig = require('../config.js');
dotenvConfig.envConfig()

test('read ini file', function(assert) {
  fileReaderPromise.then(function(result) {
    assert.equal(result['headerOnlyLibraries'][0],'protozero=1.5.1');
    assert.equal(result['compiledLibraries'][0],'ccache=3.6.4');
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



