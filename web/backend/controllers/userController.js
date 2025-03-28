const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Tạo token có chứa `role`
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400).json({ message: "Người dùng đã tồn tại" });
    return;
  }

  // Mặc định nếu không có `role` thì là `user`
  const user = await User.create({
    username,
    password,
    role: role || "user",
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role, // Trả về role
    });
  } else {
    res.status(400).json({ message: "Đăng ký thất bại" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token tạo ra:", token);

    res.json({ 
      _id: user._id, 
      username: user.username, 
      role: user.role, // Thêm role vào response
      token 
    });
  } else {
    res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password"); // Không trả về password
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "Không tìm thấy người dùng" });
    return;
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Xóa người dùng thành công!" });
});

const updateUser = asyncHandler(async (req, res) => {
  const { username, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "Không tìm thấy người dùng" });
    return;
  }

  user.username = username || user.username;
  user.role = role || user.role;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    role: updatedUser.role,
  });
});

module.exports = { registerUser, loginUser, getUsers, deleteUser, updateUser };
