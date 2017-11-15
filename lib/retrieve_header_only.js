var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
 
// var s3 = new AWS.S3();
// var params = {Bucket: process.env.MASON_BUCKET, Key: 'myImageFile.jpg'};
// var file = require('fs').createWriteStream('/path/to/file.jpg');
// s3.getObject(params).createReadStream().pipe(file);
