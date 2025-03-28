const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

exports.protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  console.log("🔍 Token nhận được:", token); // Log để kiểm tra token

  if (!token) {
    return res.status(401).json({ message: "Không có quyền truy cập, không có token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token hợp lệ, userId:", decoded.id); // Log userId từ token

    req.user = await User.findById(decoded.id).select("-password");
    console.log("👤 User tìm thấy:", req.user); // Log user lấy từ DB

    if (!req.user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    next();
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error.message); // Log lỗi nếu có
    return res.status(401).json({ message: "Không có quyền truy cập, token không hợp lệ" });
  }
});
