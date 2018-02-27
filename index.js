var log = require('npmlog');
var loader = require('./lib/retrieve_package.js');
var sym = require('./lib/symlink.js');
var path = require('path');

function download(packages, callback){
  log.info('Mason Package Install Starting');
  loader.install(packages, function(err, packageLists){
    if (err) throw err;

    log.info('Creating Symlinks');

    var paths = sym.buildLinkPaths(packageLists,path.join(process.cwd(), '/mason_packages/.link'));
    sym.symLink(paths, function(err){
      if (err) return callback(err);
    });
  });
}

module.exports = download;