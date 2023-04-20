const {
      S3
  } = require("@aws-sdk/client-s3");

  const s3 = new S3({

      region: process.env.REGION,
      credentials: {
  
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        // accessKeyId: "AKIAVSAXDMPEGVSMPBWP",
        // secretAccessKey: "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"
  
      },
      region: "us-west-2",
  });
console.log(s3)
  module.exports = s3;