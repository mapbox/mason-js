// var test = require('tape');
// var os = require('os');
// var path = require('path');
// var platform = os.platform();
// var reader = require('../lib/file_reader.js');
// var exec = require('child_process').exec;
// var appDir = process.cwd();
// var helpText = 'Usage:\n  mason-js install \n\n  or \n\n  mason-js install <package> <package type>\n\nDescription:\n  mason-js is a JS client for mason that installs c++ packages locally (both header-only and compiled). mason-js can install all packages declared in a mason-versions.ini file or it can install a single package. \n\nExample:\n  mason-js install  \n\n  OR\n\n  mason-js install protozero=1.5.1 --type=header \n\nOptions:\n  --type [header or compiled]\n';
// var fs = require('fs');
// var fse = require('fs-extra');
// var path = require('path');
// var stream = require('stream');
// var sinon = require('sinon');
// var log = require('npmlog');
// var request = require('request');
// var rimraf = require('rimraf');
// var index = require('../');

// var command_path = path.join(__dirname,'../bin/mason-js');

// test('[mason-js] missing package type', (assert) => {

//   // if (!fs.existsSync(__dirname + '/fixtures/out/protozero/1.5.1')) fse.mkdirpSync(__dirname + '/fixtures/out/protozero/1.5.1');
  
//   var src = path.join(__dirname + '/fixtures/', 'protozero1.5.1.tar.gz');
//   var dst = path.join(__dirname + '/fixtures/out', 'protozero/1.5.1');
  
//   var outfile = path.join(__dirname + '/fixtures/out', 'protozero/1.5.1', 'include', 'protozero', 'byteswap.hpp');
//   var url = 'http://fakeurl.com';

//   var options = {
//     name: 'protozero',
//     version: '1.5.1',
//     headers: true,
//     os: null,
//     awsPath: 'headers/protozero/1.5.1.tar.gz',
//     src: url,
//     dst: dst
//   };

//   var buffer = fs.readFileSync(src);

//   var mockStream = new stream.PassThrough();
//   mockStream.push(buffer);
//   mockStream.end();

//   sinon.spy(mockStream, 'pipe');
//   sinon.spy(log, 'info');

//   sinon.stub(request, 'get').returns(mockStream);

//   exec(command_path + ' install protozero=1.5.1 --type=header --save', (err, stdout, stderr) => {
//     console.log(err, stdout, stderr);
//     log.info.restore();
//     request.get.restore();
//     assert.end();
//   });
// });

// // test('cleanup', (assert) => {
// //   rimraf(__dirname + '/fixtures/out', (err) => {
// //     assert.ifError(err);
// //     assert.end();
// //   });
// // });