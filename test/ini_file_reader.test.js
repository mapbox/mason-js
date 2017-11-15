var test = require('tape');
var fileReaderPromise = require('../lib/ini_file_reader.js');

test('read ini file', function(assert) {
  fileReaderPromise.then(function(result) {
    assert.equal(result['headerOnlyLibraries'][0],'protozero=1.5.1');
    assert.equal(result['compiledLibraries'][0],'ccache=3.6.4');
    assert.end()
  });
});