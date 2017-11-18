const fs = require('fs');
const dotenvConfig = require('../config.js');
dotenvConfig.envConfig(); 
var retrievePlatform = require('../lib/check_os.js');
const path = require('path');
var headerPackagePath; 
const os = require('os');
const platform = os.platform();

function checkOS(){
  switch (platform) {
  case 'darwin':
    return 'osx-x86_64';
  case 'linux':
    // do something 
  default:
    return `"${platform}" is not a valid option`;
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
        var packagePath = path.join(osPlatform, p.name, p.version + '.tar.gz');
        p['awsPath'] = packagePath;
        libraries.push(p);
      }else if(p && line != '[headers]' && !compiledPackages){
        var packagePath = path.join('headers', p.name, p.version + '.tar.gz');
        p['awsPath'] = packagePath;
        p['headers'] = true;
        libraries.push(p);
      }
  }); 
  console.log(libraries);
  return libraries; 
}).catch(error => console.log(error)); 

module.exports = fileReaderPromise;






