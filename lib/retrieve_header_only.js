var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
 
var s3 = new AWS.S3();
var params = {Bucket: process.env.MASON_BUCKET, Key: 'myImageFile.jpg'};
var file = require('fs').createWriteStream('/path/to/file.jpg');
s3.getObject(params).createReadStream().pipe(file);

let fileReaderPromise = new Promise((resolve, reject) => {
  let fileContents = fs.readFileSync(process.env.MASON_INI_PATH); 
  resolve(fileContents);
}).then((successMessage) => {
 
}).catch(error => console.log(error)); 

module.exports = fileReaderPromise;