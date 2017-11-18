var test = require('tape');
var reader = require('../lib/retrieve_package.js');
const fs = require('fs');
const dotenvConfig = require('../config.js');
dotenvConfig.envConfig();

// test('write package from S3 into mason-packages directory', function(assert) {
//   reader.pullPackageFromS3(packageData, function(err, result) {
//     console.log(err);
//     // console.log(result);
//     assert.end()
//   });
// });