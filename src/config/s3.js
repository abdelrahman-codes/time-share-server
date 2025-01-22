const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'fra1', // Your DigitalOcean Spaces region
  endpoint: 'https://fra1.digitaloceanspaces.com',
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY,
    secretAccessKey: process.env.DO_SECRET_KEY,
  },
});

module.exports = s3;
