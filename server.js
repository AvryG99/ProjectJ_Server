const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const sql = require('mssql');

// Routes
const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');
const setupSwagger = require("./config/swagger"); // Import Swagger config

// Middleware
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const { validateSignup, validateLogin } = require('./middlewares/validateInputs');

const app = express();

// Middleware cơ bản
app.use(cors());
app.use(bodyParser.json());

// Đăng ký Swagger
setupSwagger(app); // Kích hoạt Swagger

// Logging request (nếu cần kiểm tra)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/auth', authRoutes); // Các route liên quan đến auth (login/signup)
app.use('/table', tableRoutes); // Các route liên quan đến table

// Route mẫu cho private route cần xác thực
app.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

// Middleware xử lý lỗi (phải đặt cuối cùng)
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
