const mongoose = require('mongoose');
require('dotenv').config();

const dbConnects = async () => {
    try {
        const uri = process.env.CONNECTION_STRING;
        
        if (!uri) {
            throw new Error("⛔ LỖI: CONNECTION_STRING chưa được định nghĩa trong .env!");
        }

        await mongoose.connect(process.env.CONNECTION_STRING);

        console.log("✅ Database connected!");
    } catch (err) {
        console.error("❌ Lỗi kết nối MongoDB:", err.message);
        process.exit(1);
    }
};

module.exports = dbConnects;
