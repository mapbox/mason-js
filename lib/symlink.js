var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var log = require('npmlog');


var filterFunc = (src, dest) => {
  if (src.indexOf('mason.ini') > -1) {
    return false;
  } else if (fs.lstatSync(src).isFile()){
    fs.symlinkSync(src,dest);
    return false;
  }else{
    return true;
  }
}

function buildLinkPaths(libraries,symlinkPath){
  var paths = [];

  if (fs.existsSync(symlinkPath)) {
    fse.emptyDirSync(symlinkPath);
  }

  libraries.forEach(function(l){
    paths.push([l.dst, symlinkPath]);
  });
  return paths;
}

function symLink(paths, callback){
  try{
    paths.forEach(function(p){
      fse.copySync(p[0], p[1], { clobber: true, filter:filterFunc});
      log.info('Symlinked: ', p[0], 'to ', p[1]);
    });
  } catch(e){
    return callback(e); 
  }
  return callback(null, true); 
}; 

module.exports = {buildLinkPaths:buildLinkPaths,
                  symLink:symLink};
