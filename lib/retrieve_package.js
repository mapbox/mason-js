const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const appDir = process.cwd();
var request = require('request');


const s3 = new AWS.S3();

let p = 'https://s3.amazonaws.com/mason-binaries/headers/protozero/1.5.1.tar.gz'

function pullPackageFromS3(packageData, callback){
  let bucketPath = packageData.headers ? path.join('headers', packageData.name, packageData.version + '.tar.gz') : path.join(packageData.osSystem);
  
  let writePath = path.join(appDir,'mason_packages', bucketPath);
  // let file = require('fs').createWriteStream(writePath);
  console.log(writePath);
  let r = request(p).pipe(fs.createWriteStream(writePath));

  return callback(null);
}

module.exports = {pullPackageFromS3:pullPackageFromS3}
