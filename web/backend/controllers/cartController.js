const Cart = require("../models/Cart");

// 📌 Lấy giỏ hàng
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.query.userId }).populate("items.productId");
    res.json(cart ? cart.items : []);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

// 📌 Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: "Thêm vào giỏ hàng thành công!", items: cart.items });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm!", error });
  }
};

// 📌 Cập nhật số lượng sản phẩm
exports.updateCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });

    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (item) {
      item.quantity = quantity;
    } else {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng!" });
    }

    await cart.save();
    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật giỏ hàng!", error });
  }
};

// 📌 Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa sản phẩm!", error });
  }
};

// 📌 Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });

    cart.items = []; // Xóa toàn bộ sản phẩm
    await cart.save();

    res.json({ message: "Giỏ hàng đã được làm trống!", items: [] });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa giỏ hàng!", error });
  }
};
