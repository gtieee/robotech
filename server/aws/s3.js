const { PutObjectCommand } = require('@aws-sdk/client-s3');
const AWS = require('@aws-sdk/client-s3')

const region = 'us-east-2';

const s3 = new AWS.S3Client({region: region});

module.exports = {
    upload: (params) => s3.send(new PutObjectCommand(params))
}
