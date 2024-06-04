const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const CronJob=require('cron');

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./router/userRouter");
const homePageRouter = require("./router/homePageRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");

//Models
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");
const FileURL=require('./models/fileurl');
const File=require('./models/files');

//Relationships between Tables
User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });

Chat.belongsTo(User);
Chat.belongsTo(Group);

User.hasMany(UserGroup);

Group.hasMany(Chat);
Group.hasMany(UserGroup);
UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

// User.hasMany(FileURL);
// FileURL.belongsTo(User);
// Chat.hasMany(FileURL);
// FileURL.belongsTo(Chat);

User.hasMany(File);
File.belongsTo(User, { foreignKey: 'userId' });
// User.hasMany(File, { foreignKey: 'userId' });

File.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(File);
Group.hasMany(File, { foreignKey: 'groupId' });
Chat.hasMany(File);
File.belongsTo(Chat);
// File.belongsTo(Chat);
// Chat.hasMany(File);
//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);

app.use("/homePage", homePageRouter);

app.use("/chat", chatRouter);

app.use("/group", groupRouter);

const job = require("./jobs/cron");
job.start();

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 4000);
  })
//   .catch((err) => console.log(err));