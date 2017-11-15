const fs = require('fs');
const dotenvConfig = require('../config.js');
dotenvConfig.envConfig()

let fileReaderPromise = new Promise((resolve, reject) => {
  let fileContents = fs.readFileSync(process.env.MASON_INI_PATH); 
  resolve(fileContents);
}).then((successMessage) => {
  let libraries = {"headerOnlyLibraries": [], "compiledLibraries":[]}
  let compiledPackages = false;

  successMessage.toString().split('\n').forEach(function(line){
      if (line == '[compiled]'){
        compiledPackages = true; 
      }else if(compiledPackages){
        libraries.compiledLibraries.push(line);
      }else if(line != '[headers]' && !compiledPackages){
        libraries.headerOnlyLibraries.push(line);
      }
  }); 
  // console.log(libraries);
  return libraries; 
}).catch(error => console.log(error)); 

module.exports = fileReaderPromise;




