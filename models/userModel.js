const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User=sequelize.define('users',{
  id:{
      type : Sequelize.INTEGER,
      allowNull : false,
      primaryKey : true,
      autoIncrement : true
  },
  name:{
      type : Sequelize.STRING,
      allowNull : false
  },
  email:{
      type:Sequelize.STRING,
      allowNull:false,
      unique:true
  },
  password:{
      type:Sequelize.STRING,
  },
 mobileno:{
  type:Sequelize.INTEGER,
  allowNull:true,
  unique:true,
  defaultValue: null
 }
  
  
});
module.exports = User;