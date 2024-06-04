const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const userAuthentication = require("../middleware/auth");
const {generateUploadURL}=require('../services/s3').generateUploadURL;
const multer = require('multer');
// const upload=multer({dest:'./uploads'});
const storage = multer.memoryStorage(); // store files in memory
const upload = multer({ storage });

router.post("/sendMessage", userAuthentication, chatController.sendMessage);
router.get("/getMessages", userAuthentication,chatController.getMessages);
// router.get('/images/:imageName',chatController.getImages);
router.get('/s3Url',chatController.getURL)

router.post('/sendFile',upload.single('file'),chatController.sendFile);
module.exports = router;






