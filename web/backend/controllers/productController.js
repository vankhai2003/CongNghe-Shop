const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// 📌 Lấy danh sách sản phẩm (GET /api/products)
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// 📌 Lấy một sản phẩm theo ID (GET /api/products/:id)
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }
});

// 📌 Thêm sản phẩm mới (POST /api/products)
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, price, category = "Không có danh mục", stock = 0, image, description = "" } = req.body;

  const product = new Product({
    name,
    price,
    category,
    stock,
    image,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});


// 📌 Cập nhật sản phẩm (PUT /api/products/:id)
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, price, category, stock, image, description } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.image = image || product.image;
    product.description = description || product.description;
    
    // Kiểm tra stock
    if (typeof stock !== "undefined") {
      product.stock = stock;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }
});


// 📌 Xóa sản phẩm (DELETE /api/products/:id)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Sản phẩm đã được xóa" });
  } else {
    res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }
});
