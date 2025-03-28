const Order = require("../models/Order");
const Product = require("../models/productModel");

// 📌 Tạo đơn hàng mới (Checkout)
const createOrder = async (req, res) => {
  try {
    console.log("📌 Dữ liệu nhận từ frontend:", req.body);
    console.log("👤 User từ token:", req.user); // 🔥 Log để kiểm tra

    const userId = req.user._id; // ✅ Lấy từ token, không phải từ body
    const { items, customer } = req.body;

    if (!items || items.length === 0 || !customer) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Một số sản phẩm không tồn tại" });
    }

    const productMap = new Map(products.map(p => [p._id.toString(), p.price]));
    let totalPrice = 0;
    const orderItems = [];

    for (let item of items) {
      const price = productMap.get(item.productId.toString());
      if (!price) {
        return res.status(404).json({ message: `Sản phẩm ${item.productId} không tồn tại` });
      }
      totalPrice += price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price });
    }

    const newOrder = new Order({
      userId, // ✅ Lấy từ token
      customer,
      items: orderItems,
      totalPrice,
    });

    await newOrder.save();
    res.status(201).json({ message: "Đơn hàng đã được tạo", orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// 📌 Lấy danh sách đơn hàng theo `userId`
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy userId từ token đã xác thực
    console.log("🔍 Lấy đơn hàng của user:", userId);

    const orders = await Order.find({ userId }).populate("items.productId", "name price");
    
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// 📌 Lấy tất cả đơn hàng (Chỉ admin được phép)
const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    const orders = await Order.find()
      .populate("userId", "name email") // Lấy thông tin user
      .populate("items.productId", "name price") // Lấy thông tin sản phẩm
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// 📌 Xóa đơn hàng theo `orderId`
const deleteOrder = async (req, res) => {
  try {
    console.log("📌 Xóa đơn hàng với ID:", req.params.id);
    console.log("👤 User đang thực hiện:", req.user);

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền xóa đơn hàng!" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    await order.deleteOne();
    res.json({ message: "Đơn hàng đã được xóa thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};



module.exports = { createOrder, getOrdersByUser, getAllOrders, deleteOrder };
