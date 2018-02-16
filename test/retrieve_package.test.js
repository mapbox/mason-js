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

test('[place binary] places binary', function(assert) {
    if (!fs.existsSync(__dirname + '/fixtures/out/protozero1.5.1')) fs.mkdirSync(__dirname + '/fixtures/out/protozero1.5.1');

    var from = path.join(__dirname + '/fixtures/', 'protozero1.5.1.tar.gz');
    var to = path.join(__dirname + '/fixtures/out', 'protozero1.5.1.tar.gz');
    var outfile = path.join(__dirname + '/fixtures/out', 'protozero1.5.1', 'include', 'protozero', 'byteswap.hpp');

    var buffer = fs.readFileSync(from);
    var url = 'http://fakeurl.com'; 

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

    });
    request.get.restore(); 
    assert.end();
}); 

test('[place binary] gets a request error', function(assert) {
    if (!fs.existsSync(__dirname + '/fixtures/out/protozero1.5.1')) fs.mkdirSync(__dirname + '/fixtures/out/protozero1.5.1');

    var to = 'to';
    var from = 'from';
    var url = 'http://fakeurl.com'; 

    const mockStream = {}; 
    mockStream.on = function (event, callback){ 
      if (event === 'error'){
        return callback(new Error('there was a request error')); 
      }
    }; 

    mockStream.pipe = sinon.stub();  
    mockStream.pipe.on = sinon.stub();
    
    sinon.stub(request, 'get').returns(mockStream);

    retriever.place_binary(url, to, function(err, res){
      assert.equal(err.message,'there was a request error');
    });

    request.get.restore(); 
    assert.end();


}); 

test('[place binary] request returns status code error ', function(assert) {
    if (!fs.existsSync(__dirname + '/fixtures/out/protozero1.5.1')) fs.mkdirSync(__dirname + '/fixtures/out/protozero1.5.1');

    var to = 'to';
    var from = 'from';
    var url = 'http://fakeurl.com'; 

    const mockStream = {'statusCode':200}; 
    mockStream.on = function (event, callback){ 
      if (event === 'response'){
        return callback(new Error()); 
      }
    }; 

    mockStream.pipe = sinon.stub();  
    
    sinon.stub(request, 'get').returns(mockStream);
    retriever.place_binary(url, to, function(err, res){
      assert.equal(err.message,'undefined status code downloading tarball http://fakeurl.com');
    });

    request.get.restore();
    assert.end();

}); 

// test('[place binary] request returns close error ', function(assert) {
//     if (!fs.existsSync(__dirname + '/fixtures/out/protozero1.5.1')) fs.mkdirSync(__dirname + '/fixtures/out/protozero1.5.1');

//     var to = 'to';
//     var from = 'from';
//     var url = 'http://fakeurl.com'; 

//     const mockStream = {'statusCode':200}; 
//     mockStream.on = function (event, callback){ 
//       if (event === 'close'){
//         return callback(new Error()); 
//       }
//     }; 

//     mockStream.pipe = sinon.stub();  
    
//     sinon.stub(request, 'get').returns(mockStream);
//     // how do I get access to hte response object? 
//     retriever.place_binary(url, to, function(err, res){
//       assert.equal(err.message,'Connection closed while downloading tarball file');
//     });
//     request.get.restore(); 
//     assert.end();

// });


// test('[install] logs package already exists', function(assert) {
//     var from = path.join(__dirname + '/fixtures/', 'protozero/1.5.1.tar.gz');
//     var to = path.join(__dirname + '/fixtures/out', 'protozero/1.5.1.tar.gz');
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



