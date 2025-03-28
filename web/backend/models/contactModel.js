const mongoose = require("mongoose");

// Định nghĩa Schema cho Contact
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên là bắt buộc"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Vui lòng nhập địa chỉ email hợp lệ",
      ],
    },
    mobile: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      trim: true,
      match: [/^\d{10,15}$/, "Vui lòng nhập số điện thoại hợp lệ"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Mỗi danh bạ phải thuộc về một user
      index: true, // Tạo index để tối ưu truy vấn
    },
  },
  { timestamps: true }
);

// Tạo Model từ Schema
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
