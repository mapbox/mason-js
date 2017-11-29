var fs = require('fs');
var dotenvConfig = require('../config.js');
dotenvConfig.envConfig();
var path = require('path');
var packagePath; 
var os = require('os');
var platform = os.platform();

function checkOS(){
  switch (platform) {
    case 'darwin':
      return 'osx-x86_64';
    case 'linux':
      return 'linux-x86_64';
    default:
      throw new Error(`"${platform}" is not a platform option support by mason`);
    };
}

function parseLibraries(fileContents, callback){

  var libraries = [];
  var compiledPackages = false;
  if(fileContents.toString().split('\n')[0] !== '[headers]'){
    var err = new Error();
    err.message = "Headers must be declared before compiled packages."
    return callback(err, null);
  }

  fileContents.toString().split('\n').forEach(function(line, index){
      if(line.indexOf('=') > -1){
        var package = line.split('=');
        var packageName = package[0];
        var packageVersion = package[1];
        var p = {'name':packageName, 
        'version':packageVersion, 
        'headers':null, 
        'os':null}
      }

      if (line == '[compiled]'){
        compiledPackages = true; 
      }else if(p && compiledPackages){
        // check OS here
        var osPlatform = checkOS();
        p.os = osPlatform;
        packagePath = path.join(p.os, p.name, p.version + '.tar.gz');
        p['awsPath'] = packagePath;
        libraries.push(p);
      }else if(p && line != '[headers]' && !compiledPackages){
        packagePath = path.join('headers', p.name, p.version + '.tar.gz');
        p['awsPath'] = packagePath;
        p['headers'] = true;
        libraries.push(p);
      }
  }); 
  return callback(null, libraries); 
}

function fileReader(path, callback){
  fs.readFile(path, function(err, fileContents){
    if (err) return callback(err);
    parseLibraries(fileContents, function(err, results){
      if (err) return callback(err);
      return callback(null, results);
    });
  }); 
}

<<<<<<< HEAD
module.exports = {fileReader:fileReader}
=======
module.exports = fileReader;
>>>>>>> os_check






