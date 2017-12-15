var path = require('path');
var fs = require('fs');
var appDir = process.cwd();
var request = require('request');
var log = require('npmlog');
var mkdirp = require('mkdirp');
var reader = require('../lib/ini_file_reader.js');
var url = require('url');
var existsAsync = fs.exists || path.exists;
var d3 = require('d3-queue');
var pass = require('stream').PassThrough;



var MASON_BUCKET='https://s3.amazonaws.com/mason-binaries/';

function download(url,callback) {
    log.http('GET', url);
    var req = null;
  
    try {
        var req = request.get({
          url : url,
          time : true
        },function(err, response, body){
          // log.info('Request time in ms', response.elapsedTime);
        });
    } catch (e) {
        return callback(e);
    }
    if (req) {
      req.on('response', function (res) {
        log.http(res.statusCode, url);
      });

    }
    return callback(null,req);
}

function place_binary(from,to,callback) {
    download(from,function(err,req) {
        if (err) return callback(err);
        if (!req) return callback(new Error("empty req"));
        var badDownload = false;
        var extractCount = 0;
        var tar = require('tar');

        function afterTarball(err) {
            if (err) return callback(err);
            if (badDownload) return callback(new Error("bad download"));
            if (extractCount === 0) {
                return callback(new Error('There was a fatal problem while downloading/extracting the tarball'));
            }
            log.info('tarball', 'done parsing tarball');
            callback();
        }

        function filter_func(entry) {
            log.info('install','unpacking ' + entry.path);
            extractCount++;
        }

        req.on('error', function(err) {
            badDownload = true;
            return callback(err);
        });

        req.on('close', function () {
            if (extractCount === 0) {
                return callback(new Error('Connection closed while downloading tarball file'));
            }
        });

        req.on('response', function(res) {
            if (res.statusCode !== 200) {
                badDownload = true;
                var err = new Error(res.statusCode + ' status code downloading tarball ' + from);
                err.statusCode = res.statusCode;
                return callback(err);
            }else{
              var dst = to.replace('.tar.gz','');
              mkdirp(dst,function(err) {
                  if (err) throw err; 
                  var b = new pass;
                  var c = new pass;
                  req.pipe(b);
                  req.pipe(c);
                  count = 0;
                  b.on('data',function(chunk){
                    console.log(chunk);
                    count += chunk.length;
                  })

                  b.on('end', function() { 
                    console.log('hi');
                      console.log(count); 
                      c.pipe(tar.extract({
                      cwd: dst,
                      strip: 1,
                      onentry: filter_func
                    }).on('close', afterTarball).on('error', callback));  
                  }); 
              });
              // serialize the call and use d3queue
              
            }
            
            
        });
    });
}

function install(masonPath, callback){

  reader.fileReader(masonPath, function(err, packageList) {
    var libraries = packageList;
    if (err) return callback(err); 
    var update_binary = null;
    
    var q = d3.queue(2);
    console.log(q, 'queue is logged')
    console.log(q.length, 'queue is logged')
    console.log(libraries.length);
    packageList.forEach(function(r, i){
        console.log('ivme');
        console.log(i);
        var src = url.resolve(MASON_BUCKET,r.awsPath);
        var dst = path.join(appDir,'mason_packages', r.awsPath);

        src = src.replace(/\s/g, '');
        dst = dst.replace(/\s/g, '').replace('.tar.gz','');

        existsAsync(dst,function(found) {
          if (found && !update_binary) {
              log.info('['+dst+'] Success: "' + r.name + '" already installed');
              return callback(null, libraries);
          } else {
              if (!update_binary) log.info('check','checked for "' + r.name + '" (not found locally)');
              
              q.defer(place_binary,src,dst);
              console.log(q, 'queue is logged part 2')

              if(libraries.length -1 === i){
                console.log('QUEUE!!!!');
                q.awaitAll(function(err, response) {
                  if (err) return callback(err);
                  return callback(null, libraries);
                });
              }
 
                // place_binary(src, dst, function(err, response){
                //   if (err){
                //     throw err;
                //   }else{
                //     return callback(null, libraries);
                //   }
                // });
          }


        });
    }); 


  }); 
};


function retrievePackageFromS3(libraries, callback) {


  for (var i = 0; i < libraries.length; i++) {
  }



}



module.exports = {download:download, place_binary:place_binary, install:install}
