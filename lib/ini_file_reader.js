var fs = require('fs');
var dotenvConfig = require('../config.js');
dotenvConfig.envConfig(); 
var path = require('path');
var packagePath; 
var os = require('os');
var platform = os.platform();

// // 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos','win32','android'
// const arch = os.arch();
// // 'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64', and 'x86'
// const release = os.release();
// // a string identifying the operating system release
// // POSIX systems, the operating system release is determined by calling uname(3)

function checkOS(){
  switch (platform) {
    case 'darwin':
      return 'osx-x86_64';
    case 'linux':
      return 'linux-x86_64';
      // do something 
    default:
      throw new Error(`"${platform}" is not a platform option support by mason`);
    };
}

var fileReaderPromise = new Promise((resolve, reject) => {
  console.log('in function');
  console.log(process.env.MASON_INI_PATH);
  var fileContents = fs.readFileSync(process.env.MASON_INI_PATH); 
  resolve(fileContents);
}).then((results) => {
  var libraries = [];
  var compiledPackages = false;

  results.toString().split('\n').forEach(function(line, index){
      if (index === 0 && line !== '[headers]') throw new Error("Headers must be declared before compiled packages.");

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
  console.log('hi');
  return libraries; 
}).catch(error => console.log(error)); 

module.exports = fileReaderPromise;






