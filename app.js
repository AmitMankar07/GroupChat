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
const forgotPasswordRoutes=require('./router/forgotPassword');

//Models
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");
const Forgotpassword = require('./models/forgotPassword');
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

Forgotpassword.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(File);
File.belongsTo(User, { foreignKey: 'userId' });

File.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(File);
Group.hasMany(File, { foreignKey: 'groupId' });
Chat.hasMany(File);
File.belongsTo(Chat);

//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);

app.use("/homePage", homePageRouter);

app.use("/chat", chatRouter);

app.use("/group", groupRouter);

app.use('/password',forgotPasswordRoutes);

const job = require("./jobs/cron");
job.start();

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 4000);
  })
//   .catch((err) => console.log(err));