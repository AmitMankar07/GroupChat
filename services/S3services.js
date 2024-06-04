
const AWS=require('aws-sdk');

const uploadToS3=async(data,filename,userId)=>{
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_SECRET_KEY=process.env.IAM_SECRET_KEY;
    
    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_SECRET_KEY,
        Bucket:BUCKET_NAME,
        region:'us-east-1',
    });
    
    console.log("in s3Services",s3bucket)
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }
        console.log(params);
        return new Promise((resolve,reject)=>{
          s3bucket.upload(params,(err,s3response)=>{
              if(err){
                  console.log("SOmething wrong in s3bucket upload");
                  reject(err);
              }
              else{
                  console.log("suceess upload s3bucket",s3response);
                  resolve(s3response.Location);
              }
          })
        })
    }
    
    module.exports={uploadToS3};