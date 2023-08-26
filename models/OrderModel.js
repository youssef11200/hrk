import mongoose from "mongoose";

const orderSchema=mongoose.Schema({
   
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
   orderItems:[
    {
        name:{type:String,required:true},
        qty:{type:Number,required:true},
        image:{type:String,required:true},
        price:{type:Number,required:true},
      
    }
   ],
   shippingAddress:{
    reference:{type:String,required:true},
    phoneNumber:{type:Number,require:true}
},
   paymentMethod:{
    type:String,
    required:true,
    default:"paypal"

   },
   paymentResult:{
    id:{type:String},
    status:{type:String},
    update_time:{type:String},
    email_address:{type:String},
   },
   taxPrice:{
    type:Number,
    required:true,
    default:0.0
   },
   shippingPrice:{
    type:Number,
    required:true,
    default:0.0
   },
   totalPrice:{
    type:Number,
    required:true,
    default:0.0
   },
   isPaid:{
   type:Boolean,
   required:true,
   default:false

   },
   paidAt:{
    type:Date
    },
    isDelivered:{
    type:Boolean,
    required:true,
    default:false
    },
    deliverAt:{
    type:Date
    }


},
{
    timestamps:true
}
)
 const Order=mongoose.model('order',orderSchema)
 export default Order