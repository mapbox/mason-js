var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');

function buildLinkPaths(libraries, callback) {
  var paths = [];

  var symlinkPath = path.join(global.appRoot, '/mason_packages/.link');

  if (fs.existsSync(symlinkPath)) {
    fse.emptyDirSync(symlinkPath);
  }

  libraries.forEach(function(l) {
    var src; 
    var dst = path.join(global.appRoot, `/mason_packages/.link`);
    if (l.headers) {
      src = path.join(global.appRoot, `/mason_packages/headers/${l.name}/${l.version}`);
      paths.push([src.replace(/\s/g, ''), dst.replace(/\s/g, '')]);
    } else {
      src = path.join(global.appRoot, `/mason_packages/${l.os}/${l.name}/${l.version}`);
      paths.push([src.replace(/\s/g, ''), dst.replace(/\s/g, '')]);
    }
  });
  return callback(null, paths);
}

module.exports = { buildLinkPaths: buildLinkPaths };