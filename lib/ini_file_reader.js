const fs = require('fs');
const dotenvConfig = require('../config.js');
dotenvConfig.envConfig(); 
const path = require('path');
var packagePath; 
const os = require('os');
const platform = os.platform();

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
      // do something 
    default:
      throw new Error(`"${platform}" is not a platform option support by mason`);
    };
}

let fileReaderPromise = new Promise((resolve, reject) => {
  let fileContents = fs.readFileSync(process.env.MASON_INI_PATH); 
  resolve(fileContents);
}).then((results) => {
  let libraries = [];
  let compiledPackages = false;

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
  return libraries; 
}).catch(error => console.log(error)); 

module.exports = fileReaderPromise;






