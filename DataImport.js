const Cooperative = require("./models/CooperativeModels");
const CooperativesData = require("./data/CooperativesData.js");
const Production = require("./models/ProductionModels.js");
const ProductionsData = require("./data/Data.js");
const express = require("express");
const User = require("./models/UserModels.js");
const users = require("./data/User.js");
const asyncHandler = require("express-async-handler");

const importdata = express.Router();
importdata.post(
  "/users",
  asyncHandler(async (req, res) => {
    await User.removeAllListeners({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);



// importdata.post('/signin',async(req,res)=>{
//   const {name,phoneNumber,password} = req.body
//   try {
//     const user = new User({name,phoneNumber,password})
//     await user.save()
//     res.send('post send')
//   } catch (err) {
//     res.status(422).send(err.message)
    
//   }
// })

importdata.post(
  "/productions",
  asyncHandler(async (req, res) => {
    await Production.removeAllListeners({});
    const importProducts = await Production.insertMany(ProductionsData);
    res.send({ importProducts });
  })
);

importdata.post(
  "/cooperatives",
  asyncHandler(async (req, res) => {
    await Cooperative.removeAllListeners({});
    const importUser = await Cooperative.insertMany(CooperativesData);
    res.send({ importUser });
  })
);

module.exports = importdata;
