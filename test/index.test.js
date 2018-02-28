var test = require('tape');
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var request = require('request');
var stream = require('stream');
var log = require('npmlog');
var fse = require('fs-extra');
var index = require('../');

test('[install] installs a package', function(assert) {
  var src = path.join(__dirname + '/fixtures/', 'protozero1.5.1.tar.gz');
  var dst = path.join(__dirname + '/fixtures/out', 'protozero/1.5.1');
  var outfile = path.join(__dirname + '/fixtures/out', 'protozero/1.5.1', 'include', 'protozero', 'byteswap.hpp');
  var url = 'http://fakeurl.com';

  var packageList = [{
    name: 'protozero',
    version: '1.5.1',
    headers: true,
    os: null,
    awsPath: 'headers/protozero/1.5.1.tar.gz',
    src: url,
    dst: dst
  }];

  var buffer = fs.readFileSync(src);

  var mockStream = new stream.PassThrough();
  mockStream.push(buffer);
  mockStream.end();

  sinon.spy(mockStream, 'pipe');
  sinon.spy(log, 'info');

  sinon.stub(request, 'get').returns(mockStream);

  index.install(packageList, function() {
    sinon.assert.calledOnce(mockStream.pipe);
    sinon.assert.calledTwice(log.info);
    assert.equal(log.info.getCall(0).args[0], 'check');
    assert.equal(log.info.getCall(0).args[1], 'checked for protozero (not found locally)');
    assert.equal(log.info.getCall(1).args[0], 'tarball');
    assert.equal(log.info.getCall(1).args[1], 'done parsing tarball for protozero');
    assert.equal(fs.existsSync(outfile), true);
    fse.remove(path.join(__dirname + '/fixtures/out', 'protozero'), err => {
      if (err) return console.error(err);
    });
    log.info.restore();
    request.get.restore();
    assert.end();
  });
});