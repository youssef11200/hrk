const bcrypt=require("bcryptjs")
const mongoose = require('mongoose')
const jwt=require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
const userSchema = new  mongoose.Schema({

name:{
    type:String,
    unique:true,
    required:true
    
},
email:{
    unique:true,
    type:String,
    required:true
   
    
},
password:{
    type:String,
    required:true,
    select:false
    
},
isAdmin:{
    type:Boolean,
   
    default:false,
},
role:{type:String,
    enum:["farmer","buyer"]
    }, 
    createdAt: {
        type: Date,
        default: Date.now,
      },
      isverified:{
        type:Boolean,
        default:false,
    },
      otp:Number,
       otp_expiry:Date,
       resetPasswordOtp: Number,
       resetPasswordExpiry: Date,
       
  

}

,{timestamps:true})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    });
  };

// LOGIN
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });
// userSchema.methods.matchPassword = async function (enterPassword){
// return await bcrypt.compare(enterPassword,this.password)}

//REGISTER

// userSchema.pre("save",async function(next){
//     if (!this.isModified("password")) {
//         next()}
//     const  salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password,salt)
// })
const User = mongoose.model('User', userSchema);

module.exports = User;

