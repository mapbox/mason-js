var test = require('tape');
var os = require('../lib/check_os.js');

test('check OS system and return correct platform directory', function(assert) {
  os.retrievePlatformDirectory(function(err, result) {
    assert.equal(result, 'bucketone/osx-86_x64');
    assert.end();
  });
});