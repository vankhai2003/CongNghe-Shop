const express = require("express");
const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  deleteOrder,
  getOrderById,
} = require("../../controllers/orderController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder); // Tạo đơn hàng (User đăng nhập mới được tạo)
router.get("/user", protect, getOrdersByUser); // 🛠 Không cần userId từ frontend, backend tự lấy
router.get("/all", protect, getAllOrders); // Admin lấy tất cả đơn hàng
router.delete("/:id", protect, deleteOrder); // ✅ Đúng đường dẫn, có bảo vệ quyền truy cập


module.exports = router;
