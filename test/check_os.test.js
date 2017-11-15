var test = require('tape');
var retrievePlatformDirectoryPromise = require('../lib/check_os.js');

test('check OS system and return correct platform directory', function(assert) {
  retrievePlatformDirectoryPromise.then(function(result) {
    assert.equal(result, 'bucketone/osx-86_x64');
    assert.end();
  });
});
