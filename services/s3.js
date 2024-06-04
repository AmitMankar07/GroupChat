// import dotenv from 'dotenv'
// import aws from 'aws-sdk'
// import crypto from 'crypto'
// import { promisify } from "util"
const dotenv=require('dotenv');
const aws=require('aws-sdk');
const crypto=require('crypto');
const {promisify}=require('util')

const randomBytes = promisify(crypto.randomBytes)
dotenv.config()

const region = "us-east-1"
const bucketName = process.env.BUCKET_NAME
const accessKeyId = process.env.IAM_USER_KEY
const secretAccessKey = process.env.IAM_SECRET_KEY

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})
const generateUploadURL=async()=>{
// module.exports= async function generateUploadURL() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    // Expires: 60
  })
  console.log(params);
  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  console.log("uploadurl",uploadURL)
  return uploadURL
}
module.exports={generateUploadURL};