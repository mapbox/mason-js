var fs = require('fs');
var fse = require('fs-extra');
var log = require('npmlog');
var shell = require('shelljs')

var filterFunc = function(src, dest) {
  if (src.indexOf('mason.ini') > -1) {
    return false;
  } else {
    console.log('gets here!');
    if (filterFunc.lsync.isFile()) {
      console.log('gets here!');
      shell.cp(src, dest);
      return false;
    } else {
      return true;
    }
  }
};

function buildLinkPaths(libraries, symlinkPath) {
  var paths = [];

  libraries.forEach(function(l) {
    paths.push([l.dst, symlinkPath]);
  });
  return paths;
}

function symLink(paths, callback) {
  try {
    paths.forEach(function(p) {
      var lsync = fs.lstatSync(p[0]); 
      filterFunc.lsync = lsync; 

      if (lsync.isDirectory() || lsync.isSymbolicLink()){
        fse.copySync(p[0], p[1], {overwrite:true, filter: filterFunc});
        log.info('Symlinked: ', p[0], 'to ', p[1]);
      }
    });
    return callback(null, true);
  } catch (e) {
    return callback(e); 
  }
}

module.exports = {
  buildLinkPaths: buildLinkPaths,
  symLink: symLink, 
  filterFunc: filterFunc
};