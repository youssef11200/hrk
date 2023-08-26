const express = require("express");
const asyncHandler = require("express-async-handler");
// const Production = require("../models/UserModels");
const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const generateToken=require('../utils/GenerateTokem');
const isAuthenticated = require("../Middleware/auth");
const userRouter = express.Router();
const Joi = require('joi')
const sendMail=require('../utils/sendMail');
const sendToken = require("../utils/GenerateTokem");


  // Login

  userRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res
          .status(400)
          .json({  message: "Please enter all fields" });
      }
  
      const user = await User.findOne({ email }).select("+password");
  
      if (!user) {
        return res
          .status(400)
          .json({  message: "Invalid Email or Password" });
      }
  
      const isMatch = await user.comparePassword(password);
  
      if (!isMatch) {
        return res
          .status(400)
          .json({  message: "Invalid Email or Password" });
      }
  
      sendToken(res, user, 200, "Login Successful");
    } catch (error) {
      res.status(500).json({  message: error.message });
    }
  })
// REGISTRE



userRouter.post(
  "/register",
  asyncHandler(async(req,res)=>{
    const schema = Joi.object({
     
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().min(3).max(200).required().email(),
      password: Joi.string().min(6).max(200).required(),
      role:Joi.string().required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists...");
  const otp =Math.floor(Math.random()*1000);
  
    const { name, email, password,role, } = req.body;
  
    user = new User({ name, email, password,role,otp,otp_expiry:new Date(Date.now()+process.env.OTP_EXPIRE*60*100)});
    await sendMail(email,"verify your account",`your OTP for verification is ${otp}`)
  
  
    await user.save();
  
    sendToken(
      res,
      user,
      201,
      "OTP sent to your email, please verify your account"
    );
    // res.send({user_id:user.id,
    //   name:user.name,
    //   email:user.email,
    //   isAdmin:user.isAdmin,
    //   createdAt:user.createdAt,
    //   role:user.role,
    //  });
  }))

  //     LOGOUT


  userRouter.post(
    "/logout",
    asyncHandler(async (req, res) => {
      try { res
          .status(200)
          .cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
          })
          .json({ success: true, message: "Logged out successfully" });
      } catch (error) {
        res.status(500).json({  message: error.message });
      }
    })
  );





    
//    PROFILE

userRouter.get("/profile",
isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id) 
    if (user) {
      res.json({user_id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        role:user.role,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,})
    }
     else {
      res.status(404)
      throw new Error("user not found ")

      
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  isAuthenticated,
  asyncHandler(
      async(req ,res)=>{
          const user= await User.findById(req.user._id)
         
         if (user) {
          user.name=req.body.name||user.name
          user.email=req.body.email||user.email
          if(req.body.password){
              user.password=req.body.password
          }
          const updateUser=await user.save()
          res.json({
              user_id:updateUser._id,
              name:updateUser.name,
              email:updateUser.email,
              isAdmin:updateUser.isAdmin,
              token: generateToken(updateUser._id) ,
              createdAt:updateUser.createdAt,
              

          })
          
         } else {
          res.status(401)
          throw new Error("User Not found")
         }
      }
  )
)
userRouter.post(
  "/verify",isAuthenticated,
  asyncHandler(async(req,res)=>{
     try { const otp =Number(req.body.otp)
      const user= await User.findById(req.user._id)
      if (user.otp !==otp || user.otp_expiry < Date.now()) {
        return (
        res.status(400).json({message:"invalid OPT or has been Expired"})
        )}
        user. isverified=true 
        user.otp=null
        user.otp_expiry=null
        await user.save()
        sendToken(res, user, 200, "Account Verified");
      
    } catch (error) {
      res.status(500).json({message:error.message})
    } 
   

  }))



  //     UPDATE PROFILE
  userRouter.put(
    "/updateprofile",
    isAuthenticated,
   asyncHandler( async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      const { name  } = req.body;
      // const avatar = req.files.avatar.tempFilePath;
  
      if (name) user.name = name;
      // if (avatar) {
      //   await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  
      //   const mycloud = await cloudinary.v2.uploader.upload(avatar);
  
      //   fs.rmSync("./tmp", { recursive: true });
  
      //   user.avatar = {
      //     public_id: mycloud.public_id,
      //     url: mycloud.secure_url,
      //   };
      // }
  
      await user.save();
  
      res
        .status(200)
        .json({ message: "Profile Updated successfully" });
    } catch (error) {
      res.status(500).json({  message: error.message });
    }
  }))
  


  //    UPDATE PASSWORD


  userRouter.put(
    "/updatepassword",
    isAuthenticated,
    asyncHandler(
        
      async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("+password");
  
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({  message: "Please enter all fields" });
      }
  
      const isMatch = await user.comparePassword(oldPassword);
  
      if (!isMatch) {
        return res
          .status(400)
          .json({  message: "Invalid Old Password" });
      }
  
      user.password = newPassword;
  
      await user.save();
  
      res
        .status(200)
        .json({   message: "Password Updated successfully" });
    } catch (error) {
      res.status(500).json({  message: error.message });
    }
  }
    ))




    /// FORGOT PASSWORD
    userRouter.put(
      "/forgotpassword",
      asyncHandler(
       async (req, res) => {
      try {
        const { email } = req.body;
    
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(400).json({ success: false, message: "Invalid Email" });
        }
    
        const otp = Math.floor(Math.random() * 1000000);
    
        user.resetPasswordOtp = otp;
        user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;
    
        await user.save();
    
        const message = `Your OTP for reseting the password ${otp}. If you did not request for this, please ignore this email.`;
    
        await sendMail(email, "Request for Reseting Password", message);
    
        res.status(200).json({ success: true, message: `OTP sent to ${email}` });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }));

// GET PROFILE 

userRouter.put(
  "/me",
  asyncHandler( async (req, res) =>{
    try {
      const user = await User.findById(req.user._id);
  
      sendToken(res, user, 201, `Welcome back ${user.name}`);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }))


    // RESET PASSWORD

    userRouter.put(
      "/resetpassword",
      asyncHandler( async (req, res) => {
      try {
        const { otp, newPassword } = req.body;
    
        const user = await User.findOne({
          resetPasswordOtp: otp,
          resetPasswordExpiry: { $gt: Date.now() },
        });
    
        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: "Otp Invalid or has been Expired" });
        }
        user.password = newPassword;
        user.resetPasswordOtp = null;
        user.resetPasswordExpiry = null;
        await user.save();
    
        res
          .status(200)
          .json({ success: true, message: `Password Changed Successfully` });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }));

// userRouter.get(
//   "/",
//   isAuthenticated,
//   admin,
//   asyncHandler(async (req, res)=>{
//       const users=await User.find({})
     
//       res.json(users)

//   })
// )
   
module.exports = userRouter;
