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

var MASON_BUCKET='https://s3.amazonaws.com/mason-binaries/';

function place_binary(from,to,callback) {
    var dst = to.replace('.tar.gz','');

    var req = request.get({
      url : url,
      time : true
    });

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
        }
    });

    req.pipe(tar.extract({
      cwd: dst,
      strip: 1,
      onentry: filter_func
    }).on('close', afterTarball).on('error', callback));
}

function buildPaths(r){
  var src = url.resolve(MASON_BUCKET,r.awsPath);
  var dst = path.join(appDir,'mason_packages', r.awsPath);
  return {src:src, dst:dst}
}

function install(masonPath, callback){

  reader.fileReader(masonPath, function(err, packageList) {
    var libraries = packageList;
    if (err) return callback(err); 
    var update_binary = null;
    
    var q = d3.queue(1);

    packageList.forEach(function(r, i){

        var options = buildPaths(r); 

        src = options.src.replace(/\s/g, '');
        dst = options.dst.replace(/\s/g, '').replace('.tar.gz','');

        existsAsync(dst,function(found) {
          if (found && !update_binary) {
              log.info('['+dst+'] Success: "' + r.name + '" already installed');
              return callback(null, libraries);
          } else {
              if (!update_binary) log.info('check','checked for "' + r.name + '" (not found locally)');
              
              var dest = dst.replace('.tar.gz','');

              mkdirp.sync(dest);

              q.defer(place_binary,src,dst);

              if(libraries.length - 1 === i){
                q.awaitAll(function(err, response) {
                  if (err) return callback(err);
                  return callback(null, libraries);
              });
            }
          }
        });
    }); 


  }); 
};

module.exports = {place_binary:place_binary, install:install, buildPaths:buildPaths}
