const mongoose= require( "mongoose");


// const reviewSchema = mongoose.Schema({
//   name: { String },
//   rating: { Number },
//   comment: { String },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
// });
const productionSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      require: true,
    },
    productType: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    availableQuantity: {
      type: Number,
      require: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    adress: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);
const Production = mongoose.model("Production", productionSchema);
module.exports = Production;
