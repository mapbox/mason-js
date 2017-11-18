// const os = require('os');
// const path = require('path');
// const dotenvConfig = require('../config.js');
// dotenvConfig.envConfig();


// // 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos','win32','android'
// const arch = os.arch();
// // 'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64', and 'x86'
// const release = os.release();
// // a string identifying the operating system release
// // POSIX systems, the operating system release is determined by calling uname(3)

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