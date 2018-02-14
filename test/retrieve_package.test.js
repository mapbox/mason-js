var test = require('tape');
var loader = require('../lib/retrieve_package.js');
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var request = require('request');
var retriever = require('../lib/retrieve_package');
var rimraf = require('rimraf'); 
var ErrorHTTP = require('mapbox-error').ErrorHTTP;
var stream = require('stream');
var log = require('npmlog');

global.appRoot = process.cwd();

test('setup', (assert) => {
  if (!fs.existsSync(__dirname + '/fixtures/out')) fs.mkdirSync(__dirname + '/fixtures/out');
  assert.end();
});

test('[download package] returns 200 response with tar buffer', function(assert) {
    var src = path.join(__dirname + '/fixtures/', 'protozero1.5.1.tar.gz');
    var buffer = fs.readFileSync(src);
    var url = 'http://fake.url.com'
    var res = {statusCode: 200, elapsedTime:20, on:sinon.stub(), Body:buffer}
    
    sinon.stub(request, 'get').returns(res);

    retriever.download(url, function(err, resp){
      assert.equal(resp.Body, res.Body);
      assert.equal(request.get.callCount, 1, 'called request.get once');

      request.get.restore(); 
    });
    
    assert.end();
}); 

// test('[download package] errors on 400 response ', function(assert) {
//     var url = 'http://fakeurl.com'
//     var params = {
//           url : url,
//           time : true
//         }

//     sinon.stub(request, 'get').callsFake(function(params, callback) {
//       var err = new Error({message:'Requested resource not found', status:400, elapsedTime:30});
//       callback('hi');
//     });


//     retriever.download(url, function(err, res){
//       console.log(1, 'err', err, 'res', res);
//       // assert.equal(err, 'Requested resource not found');
//       // assert.equal(err.status, 400);
//     });

//     request.get.restore(); 
//     assert.end();
// }); 

test('[place binary] empty req', function(assert) {
    var from = path.join(__dirname + '/fixtures/', 'protozero1.5.1.tar.gz');
    var to = path.join(__dirname + '/fixtures/out', 'protozero1.5.1.tar.gz');
    var buffer = fs.readFileSync(from);
    var url = 'http://fakeurl.com'; 
    var params = {
      url : url,
      time : true
    }

    sinon.stub(request, 'get').callsFake(function(params, callback) {
      callback(null, {});
    });

    retriever.place_binary(url, to, function(err, res){
      assert.equal(err.message, "empty req")
      request.get.restore(); 
    });

    assert.end();
}); 

test('[place binary] places binary', function(assert) {
    if (!fs.existsSync(__dirname + '/fixtures/out/protozero1.5.1')) fs.mkdirSync(__dirname + '/fixtures/out/protozero1.5.1');

    var from = path.join(__dirname + '/fixtures/', 'protozero1.5.1.tar.gz');
    var to = path.join(__dirname + '/fixtures/out', 'protozero1.5.1.tar.gz');
    var outfile = path.join(__dirname + '/fixtures/out', 'protozero1.5.1', 'include', 'protozero', 'byteswap.hpp');

    var buffer = fs.readFileSync(from);
    var url = 'http://fakeurl.com'; 
    
    var params = {
      url : url,
      time : true
    }

    const mockStream = new stream.PassThrough();
    mockStream.push(buffer);
    mockStream.statusCode = 200;
    mockStream.end(); 

    sinon.spy(mockStream, 'pipe');
    sinon.spy(log, 'info');
    
    sinon.stub(request, 'get').returns(mockStream);

    retriever.place_binary(url, to, function(err, res){

      sinon.assert.calledOnce(mockStream.pipe);
      sinon.assert.calledOnce(log.info);
      assert.equal(log.info.getCall(0).args[0], 'tarball');
      assert.equal(log.info.getCall(0).args[1], 'done parsing tarball');
      assert.equal(fs.existsSync(outfile), true);

      request.get.restore(); 
    });

    assert.end();
}); 

// test.only('[install] logs package already exists', function(assert) {
//     var from = path.join(__dirname + '/fixtures/', 'protozero1.5.1.tar.gz');
//     var to = path.join(__dirname + '/fixtures/out', 'protozero1.5.1.tar.gz');
//     var buffer = fs.readFileSync(from);
//     var url = 'http://fakeurl.com'
//     var res = {statusCode: 400, elapsedTime:20, on:sinon.stub(), res: {Body:buffer}}
    
//     sinon.stub(retriever, 'download').returns(res);

//     retriever.place_binary(from, to, function(err, res){
//       // console.log(err, res)
//       retriever.download.restore(); 
//     });

//     assert.end();
// }); 


// test('cleanup', (assert) => {
//   rimraf(__dirname + '/fixtures/out', (err) => {
//     assert.ifError(err);
//     assert.end();
//   });
// });



