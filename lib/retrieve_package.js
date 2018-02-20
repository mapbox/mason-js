var path = require('path');
var fs = require('fs');
var request = require('request');
var log = require('npmlog');
var mkdirp = require('mkdirp');
var existsAsync = fs.exists || path.exists;
var d3 = require('d3-queue');


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
  existsAsync(options.dst, function(found) {
    if (found && !options.update_binary) {
      log.info('[' + options.dst + ']', 'Success: ' + options.name + ' already installed');
      return callback(null, true);
    } else {
      mkdirp(options.dst, function(err) {
        if (err) return callback(err);
        return callback(null, false);
      });
    }
  });
}

function install(packageList, callback) {
  var libraries = packageList;
  var q = d3.queue(1);

  libraries.forEach(function(options, i) {
    options.update_binary = null;
    if (options) {
      checkLibraryExists(options, function(err, exists) {
        if (!exists) {
          log.info('check', 'checked for ' + options.name + ' (not found locally)');
          q.defer(place_binary, options);
          if (libraries.length - 1 === i) {
            q.awaitAll(function(err) {
              if (err) return callback(err);
              return callback(null, libraries);
            });
          }
        }
      });
    }

  });
}

module.exports = {
  place_binary: place_binary,
  install: install,
  checkLibraryExists: checkLibraryExists
};