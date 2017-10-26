var os = require('os');
var path = require('path');
var MASON_BUCKET=process.env.MASON_BUCKET_ROOT;

var platform = os.platform();
// 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos','win32','android'
var arch = os.arch(); 
// 'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64', and 'x86'
var release = os.release();
// a string identifying the operating system release
// POSIX systems, the operating system release is determined by calling uname(3)

var release_major_v = release.substring(0,2);
var map_darwin_to_osx = {'15':'osx-10.9','16':'osx-10.10','17':'osx-10.11'};

// use this as a way to validate events and event-specific flags
function retrieveOSMainS3Directory(callback){
  switch(platform) {
  case 'darwin':
    var s3_os_directory = 'osx-all';
    if(parseInt(release_major_v)>15){
      s3_os_directory = map_darwin_to_osx[release_major_v];
    }
    return callback(path.join(MASON_BUCKET,s3_os_directory));
  case 'linux':
    // do something 
  default:
    return callback(`"${platform}" is not a valid option`);
  }
}


