const mongoose = require("mongoose");
const { Schema } = mongoose;

const CooperativeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    productName: { type: String, require: true },
    productType: { type: String, require: true },
    aviableQuantity: { type: String, require: true },
    price: { type: String, require: true },
    status: {
      title: "String",
      aviable: Boolean,
      createdAt: Date,
    },
    date: { type: Date, default: Date.now },
    meta: { votes: Number },
    distanceAviable: { type: Number, require: true },
  },
  { timestamps: true }
);
const Cooperative = mongoose.model("Cooperative", CooperativeSchema);
module.exports = Cooperative;
