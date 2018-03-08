var request = require('request');
var log = require('npmlog');
var extfs = require('extfs');
var fse = require('fs-extra');


function place_binary(options, callback) {
  var req = request.get({
    url: options.src,
    time: true
  });

  var badDownload = false;
  var extractCount = 0;
  var tar = require('tar');

  function afterTarball(err) {
    if (err) return callback(err);
    if (badDownload) return callback(new Error('bad download'));
    if (extractCount === 0) {
      return callback(new Error('There was a fatal problem while downloading/extracting the tarball'));
    }
    log.info('tarball', `done parsing tarball for ${options.name}`);
    callback();
  }

  function filter_func() {
    extractCount++;
  }

  req.on('error', function(err) {
    badDownload = true;
    return callback(err);
  });

  req.on('close', function() {
    if (extractCount === 0) {
      return callback(new Error('Connection closed while downloading tarball file'));
    }
  });

  req.on('response', function(res) {
    if (res.statusCode !== 200) {
      badDownload = true;
      var err = new Error(res.statusCode + ' status code downloading tarball ' + options.src);
      err.statusCode = res.statusCode;
      return callback(err);
    }
  });

  req.pipe(tar.extract({
    cwd: options.dst,
    strip: 1,
    onentry: filter_func
  }).on('close', afterTarball).on('error', callback));
}

function checkLibraryExists(options, callback) {  
  try{
    var found = fse.pathExistsSync(options.dst);
  } catch(e){
    return callback(e);
  }

  if (found) {
  // this handles a situation where a download fails and 
  // the directories are created for packages that were never downloaded 
  // & extracted into those path
    var empty = extfs.isEmptySync(options.dst);
    if (empty){
      return callback(null, false);
    }else{
      log.info('[' + options.dst + ']', 'Success: ' + options.name + ' already installed');
      return callback(null, true);
    }
  }else {
    try{
      log.info('check', 'checked for ' + options.name + ' (not found locally)');
      fse.mkdirpSync(options.dst); 
      return callback(null, false); 
    }catch(e){
      return callback(e);
    }
  }
}

module.exports = {
  place_binary: place_binary,
  checkLibraryExists: checkLibraryExists
};
