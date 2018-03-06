var log = require('npmlog');
var loader = require('./lib/retrieve_package.js');
var sym = require('./lib/symlink.js');
var path = require('path');
var reader = require('./lib/file_reader.js');
var fse = require('fs-extra');
var fs = require('fs');
var d3 = require('d3-queue');

/* eslint-disable */

function link(masonPath, callback){
// linting is disabled because it errors on callback param

/* eslint-disable */
  if (fs.existsSync(path.join(process.cwd(), '/mason_packages/.link'))) {
    fse.removeSync(path.join(process.cwd(), '/mason_packages/.link'));
  }
  reader.fileReader(masonPath, function(err, packages){
    if (err) return callback(err);
    var paths = sym.buildLinkPaths(packages,path.join(process.cwd(), '/mason_packages/.link'));
    sym.symLink(paths, function(err, result){
      if (err) return callback(err);
      return callback(result);
    });
  });
}  

function install(packageList, callback) {
  var libraries = packageList;
  var q = d3.queue(1);
  var update = false;

  libraries.forEach(function(options, i) {
    if (options) {
      loader.checkLibraryExists(options, function(err, exists) {
        if (!exists) {
          update = true;
          log.info('check', 'checked for ' + options.name + ' (not found locally)');
          q.defer(loader.place_binary, options);
          if (libraries.length - 1 === i) {
            q.awaitAll(function(err) {
              if (err) return callback(err);
              return callback(null);
            });
          }
        }
      });
    }
  });
}



module.exports = {
  install:install, 
  link:link};