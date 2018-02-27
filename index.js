var log = require('npmlog');
var loader = require('./lib/retrieve_package.js');
var sym = require('./lib/symlink.js');
var path = require('path');
var reader = require('./lib/file_reader.js');
var fse = require('fs-extra');
var fs = require('fs');

/* eslint-disable */


function download(packages, callback){
  log.info('Mason Package Install Starting');
  loader.install(packages, function(err){
    if (err) throw err;
  });
}

function link(masonPath, callback){
  if (fs.existsSync(path.join(process.cwd(), '/mason_packages/.link'))) {
    fse.removeSync(path.join(process.cwd(), '/mason_packages/.link'));
  }
  reader.fileReader(masonPath, function(err, packages){
    if (err) return callback(err);
    var paths = sym.buildLinkPaths(packages,path.join(process.cwd(), '/mason_packages/.link'));
    sym.symLink(paths, function(err){
      if (err) return callback(err);
    });
  });
}  

/* eslint-disable */


module.exports = {download:download, 
  link:link};