const Contact = require("../models/contactModel");
const asyncHandler = require("express-async-handler");

// Lấy tất cả liên hệ của user hiện tại
exports.getAllContacts = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  
  const contacts = await Contact.find({ userId: req.user.id });
  res.status(200).json(contacts);
});

// Thêm liên hệ mới
exports.createContact = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  const { name, email, mobile } = req.body;
  if (!name || !email || !mobile) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  const newContact = await Contact.create({
    name,
    email,
    mobile,
    userId: req.user.id,
  });

  res.status(201).json(newContact);
});

// Lấy liên hệ theo ID
exports.getContactById = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  const contact = await Contact.findOne({ _id: req.params.id, userId: req.user.id });

  if (!contact) {
    return res.status(404).json({ message: "Không tìm thấy liên hệ" });
  }

  res.status(200).json(contact);
});

// Cập nhật liên hệ
exports.updateContact = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedContact) {
    return res.status(404).json({ message: "Không tìm thấy liên hệ" });
  }

  res.status(200).json(updatedContact);
});

// Xóa liên hệ
exports.deleteContact = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

  if (!contact) {
    return res.status(404).json({ message: "Không tìm thấy liên hệ" });
  }

  res.status(200).json({ message: "Đã xóa liên hệ thành công" });
});
