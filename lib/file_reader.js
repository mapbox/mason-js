var fs = require('fs');
var path = require('path');
var packagePath;
var os = require('os');
var platform = os.platform();
var MASON_BUCKET = 'https://s3.amazonaws.com/mason-binaries/';
var appDir = process.cwd();
var url = require('url');

function checkOS() {
  switch (platform) {
  case 'darwin':
    return 'osx-x86_64';
  case 'linux':
    return 'linux-x86_64';
  default:
    throw new Error(`${platform} is not a platform option support by mason`);
  }
}

var libraries = [];
var compiledPackages = false;

function buildParams(package, type) {

  if (package.indexOf('=') > -1) {
    var singlePackage = package.split('=');
    var packageName = singlePackage[0];
    var packageVersion = singlePackage[1];
    var p = {
      'name': packageName,
      'version': packageVersion,
      'headers': null,
      'os': null
    };
  }

  if (package == '[compiled]' || type === 'compiled') {
    compiledPackages = true;
  } else if (p && compiledPackages) {
    // check OS here
    var osPlatform = checkOS();
    p.os = osPlatform;
    packagePath = path.join(p.os, p.name, p.version + '.tar.gz');
    p['awsPath'] = packagePath;
    p['src'] = url.resolve(MASON_BUCKET, p.awsPath).replace(/\s/g, '');
    p['dst'] = path.join(appDir, 'mason_packages', p.awsPath).replace(/\s/g, '').replace('.tar.gz', '');
    libraries.push(p);
  } else if (p && package != '[headers]' && !compiledPackages) {
    packagePath = path.join('headers', p.name, p.version + '.tar.gz');
    p['awsPath'] = packagePath;
    p['headers'] = true;
    p['src'] = url.resolve(MASON_BUCKET, p.awsPath).replace(/\s/g, '');
    p['dst'] = path.join(appDir, 'mason_packages', p.awsPath).replace(/\s/g, '').replace('.tar.gz', '');
    libraries.push(p);
  }

  return libraries;
}

function parseLibraries(fileContents, callback) {
  if (fileContents.toString().split('\n')[0] !== '[headers]') {
    var err = new Error();
    err.message = 'Headers must be declared before compiled packages.';
    return callback(err, null);
  }

  fileContents.toString().split('\n').forEach(function(line) {
    buildParams(line, null);
  });
  return callback(null, libraries);
}


function fileReader(path, callback) {
  fs.readFile(path, function(err, fileContents) {
    if (err) return callback(err);
    parseLibraries(fileContents, function(err, libraries) {
      if (err) return callback(err);
      return callback(null, libraries);
    });
  });
}

module.exports = {
  fileReader: fileReader,
  buildParams: buildParams
};