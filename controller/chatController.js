const path = require("path");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require('../models/groupModel');
const sequelize = require("../util/database");
const { Op } = require("sequelize");
const AWS=require('aws-sdk');
const File=require('../models/files')
const s3url=require('../services/s3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multerS3 = require("multer-s3");
const uploadToS3=require('../services/S3services').uploadToS3;
const FileURL=require('../models/fileurl');
const multer=require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// const upload = multer({ storage });

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("getMessages", async (groupName) => {
    try {
      const group = await Group.findOne({ where: { name: groupName } });
      const messages = await Chat.findAll({
        where: { groupId: group.dataValues.id },
      });
      console.log("Request Made");
      io.emit("messages", messages);
    } catch (error) {
      console.log(error);
    }
  });
});
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});




const upload=multer({dest:'./uploads'});

exports.sendFile=async(req,res,next)=>{
try{
// console.log("Req",req);
// const userId=req.user.id;
// console.log("Req",userId);

// const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.TOKEN);
//     const userId = decoded.id;
// console.log("userid in sendfile",userId);

console.log("in esnd filr req.body ",req.body);
const userId = req.body.userId;

const user = await User.findOne({ where: { id: userId } });
if (!user) {
  return res.status(404).send({ message: "User not found" });
}
console.log("userid in sendfile", userId);
  console.log("in esnd filr req.file",req.file);
  const file=req.file;
  const { name, type, data } = req.body;

  const group = await Group.findOne({
    where: { name: req.body.groupName },
  });

  console.log("in group",group);

  const newChat = await Chat.create({
    name: user.name,
    message: `File uploaded: ${file.originalname}`,
    userId: userId,
    groupId: group.dataValues.id,
  });
  console.log("newchat", newChat);

  const uploads3=await uploadToS3(file.buffer,file.originalname,userId);
  const fileUrl = uploads3.Location;
  console.log("S3 url ",uploads3);

  
  // res.send(`File uploaded successfully!`);
   const newFile = await File.create({
    name:file.originalname,
    type:file.mimetype,
   s3Url:uploads3,
    userId:userId,
   groupId: group.dataValues.id,
   chatId:newChat.id,
  });
  console.log("newfile",newFile);
  res.status(200).send({ fileUrl:uploads3});
}catch (err){
  console.error(err);
  res.status(500).send(`Error uploading file: ${err}`);

}
}

exports.sendMessage = async (req, res, next) => {
  try {
    console.log("in send message controller")
    console.log(req.body);
    // console.log(req.files);
    const group = await Group.findOne({
      where: { name: req.body.groupName },
    });
    console.log(group);
    console.log("req.data:",req.body);
    
    let fileUrl = '';
    if (req.file) {
      console.log("req.file:",req.file);
      fileUrl = req.file.location;
      console.log("fileurl:",fileUrl);
      // const newFileUrl = await createFileUrl(req.file);
      // fileUrl = await uploadToS3(req.file.buffer, req.file.originalname);
    }
    // console.log("req",req);
    await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
      groupId: group.dataValues.id,
      fileUrl:fileUrl,
    });
    if (fileUrl) {
      await Chat.addFileURL(fileUrl);
    }
    console.log("fileurl",fileUrl);
    const messages = await Chat.findAll({
      where: {
        groupId: group.dataValues.id,
      },
      order: [['createdAt', 'DESC']],
      include: [{ model: File }],
    });
    return res.status(200).json({ message: "Success!",messages: messages ,fileUrl:fileUrl });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};
exports.getURL=async(req,res,next)=>{
  console.log("in get url controler");
  const url = await s3url.generateUploadURL();
    
  res.send({url})
}

exports.getMessages = async (req, res, next) => {
  try {
    console.log("in get message controller")
    const param = req.query.param;
    const userId=req.user;
    console.log("param,userid,:",param,userId,req.body);
   
console.log(req.body);


    const group = await Group.findOne({
      where: { name: req.query.groupName },
    });
    const messages = await Chat.findAll({
      where: {
        [Op.and]: {
          id: {
            [Op.gt]: param,
          },
          groupId: group.dataValues.id,
        },
      },
      include: [{ model: File
        // attributes: [ 's3Url'] 
       }],
    });
    console.log("in get message controler",messages);
    return res.status(200).json({ messages: messages });
  } catch (error) {
    console.log(error);
  }
};