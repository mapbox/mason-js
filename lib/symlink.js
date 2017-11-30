var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

function buildLinkPaths(libraries, callback){
  var paths = [];

  var symlinkPath = path.join(global.appRoot, '/mason_packages/.link');

  if(fs.existsSync(symlinkPath)){
    fse.emptyDirSync(symlinkPath);
  };

  libraries.forEach(function(l){
    if (l.headers){
      var src = path.join(global.appRoot, `/mason_packages/headers/${l.name}/${l.version}/include`);
      var dst = path.join(global.appRoot, '/mason_packages/.link/');
      paths.push([src.replace(/\s/g, ''),dst.replace(/\s/g, '')]);
    }else{
      var src = path.join(global.appRoot, `/mason_packages/${l.os}/${l.name}/${l.version}`);
      var dst = path.join(global.appRoot, `/mason_packages/.link/${l.name}/`);
      paths.push([src.replace(/\s/g, ''),dst.replace(/\s/g, '')]);
    }
  });
  return callback(null, paths);
}

module.exports = {buildLinkPaths:buildLinkPaths};