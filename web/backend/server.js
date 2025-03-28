const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/api/contactRoutes');
const userRoutes = require('./routes/api/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const dbConnects = require('./config/dbConnect');

const orderRoutes = require("./routes/api/orderRoutes");
const productRoutes = require("./routes/api/productRoutes");
const cartRoutes = require('./routes/api/cartRoutes');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

// Kết nối MongoDB
dbConnects();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

console.log("🔍 CONNECTION_STRING:", process.env.CONNECTION_STRING);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Máy chủ chạy tại http://localhost:${PORT}`));
