const bcrypt = require("bcryptjs");

const hashedPassword = bcrypt.hashSync("admin123", 10); // Thay "admin123" bằng mật khẩu bạn muốn
console.log("Mật khẩu đã mã hóa:", hashedPassword);
