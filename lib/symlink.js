var fs = require('fs');
var fse = require('fs-extra');

function buildLinkPaths(callback){
  var paths = [];
  var libs = global.libraries; 

  var symlinkPath = global.appRoot + '/mason_packages/.link'

  if(fs.existsSync(symlinkPath)){
    fse.emptyDirSync(symlinkPath);
  };

  libs.forEach(function(l){
    if (l.headers){
      var src = global.appRoot + `/mason_packages/headers/${l.name}/${l.version}.tar.gz/include`;
      var dst = global.appRoot + '/mason_packages/.link/include/';
      paths.push([src.replace(/\s/g, ''),dst.replace(/\s/g, '')]);
    }else{
      var src = global.appRoot + `/mason_packages/${l.os}/${l.name}/${l.version}.tar.gz`;
      var dst = global.appRoot + `/mason_packages/.link/include/${l.name}/`;
      paths.push([src.replace(/\s/g, ''),dst.replace(/\s/g, '')]);
    }
  });
  return callback(null, paths);
}

module.exports = {buildLinkPaths:buildLinkPaths};