const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ["Books", "Stationery"], required: true },
  image: { type: String, default: "" },
  stock: { type: Number, default: 0, min: 0 },
  brand: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
