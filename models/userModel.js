const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Forgotpassword=require('./forgotPassword');
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
User.prototype.createForgotpassword = async function({ isActive }) {
    try {
        const forgotPassword = await Forgotpassword.create({
            userId: this.id,
        
            isActive: isActive
        });
        return forgotPassword;
    } catch (error) {
        throw new Error(error);
    }
}
module.exports = User;