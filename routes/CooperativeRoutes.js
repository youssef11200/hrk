const express = require("express");
const asyncHandler = require("express-async-handler");
const Cooperative = require("../models/CooperativeModels");
const protect = require("../Middleware/auth");

const cooperativeRouter = express.Router();

 // GET ALL Cooperative

cooperativeRouter.get("/",
  asyncHandler(async (req, res) => {
    const cooperative = await Cooperative.find({});
    res.json(cooperative);
  })
);
// GET Cooperative BY ID

cooperativeRouter.get( "/:id",
    asyncHandler(async (req, res) => {
      const cooperative = await Cooperative.findById(req.params.id);
      if(cooperative){
        res.json(cooperative);
      }
     
      else{
        res.status(404)
        throw new Error('Cooperative not found')
      }
    })
  );

  // COOPERATIVE  STATUS COMMANDE 
  // cooperativeRouter.get("/statuscooperative",protect,
  // asyncHandler(async (req, res) => {
  //   try {
    
  
  //     const cooperative = await Cooperative.findById(req.cooperative._id);
  
  //     cooperative.status=cooperative.status.find((status)=>status._id.toString()===statusId.toString())
  //     cooperative.status.aviable=!cooperative.status.aviable
  // await cooperative.save()
  //     await cooperative.save();
  
  //     res.status(200).json({  message: "cooperative modify successfully" });
  //   } catch (error) {
  //     res.status(500).json({  message: error.message });
  //   }
  
  

  // }))

  // add status ref

  // export const addTask = async (req, res) => {
  //   try {
  //     const { title } = req.body;
  
  //     const cooperative = await Cooperative.findById(req.cooperative._id);
  
  //     cooperative.tasks.push({
  //       title,
  //       aviable:false,
  //       createdAt: new Date(Date.now()),
  //     });
  
  //     await cooperative.save();
  
  //     res.status(200).json({ message: "Task added successfully" });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };

module.exports = cooperativeRouter;
