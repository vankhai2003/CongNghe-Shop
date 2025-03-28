const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { type: String, required: true, default: "Không có danh mục" }, // ➡ Thêm category
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
