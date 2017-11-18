// const os = require('os');
// const path = require('path');
// const dotenvConfig = require('../config.js');
// dotenvConfig.envConfig();



// // use this as a way to validate events and event-specific flags
// let retrievePlatformDirectoryPromise = new Promise((resolve, reject) => {
//   const platform = os.platform();
//   resolve(platform);
// }).then((platformSuccess) => {
//   switch (platformSuccess) {
//     case 'darwin':
//       let s3_os_directory = 'osx-86_x64';
//       return path.join(process.env.MASON_BUCKET, s3_os_directory);
//     case 'linux':
//       // do something 
//     default:
//       return `"${platform}" is not a valid option`;
//   };
// }).catch(error => console.log(error));

// module.exports = retrievePlatformDirectoryPromise;