const express = require("express");
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  } = require("../../controllers/productController");
  
  const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

// 📌 API Sản phẩm
router.get("/", getProducts); // Lấy danh sách sản phẩm
router.get("/:id", getProductById); // Lấy sản phẩm theo ID
router.post("/", protect, createProduct); // Thêm sản phẩm (chỉ admin)
router.put("/:id", protect, updateProduct); // Cập nhật sản phẩm
router.delete("/:id", protect, deleteProduct); // Xóa sản phẩm

module.exports = router;
