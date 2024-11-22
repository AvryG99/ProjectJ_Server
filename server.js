const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const sql = require('mssql');
// Routes
const authRoutes = require('./routes/authRoutes');

// Middleware
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const { validateSignup, validateLogin } = require('./middlewares/validateInputs');
const app = express();

// Middleware cơ bản
app.use(cors());
app.use(bodyParser.json());

// Logging request (nếu cần kiểm tra)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

const dbConfig = {
    user: process.env.EHR_DB_USER,
    password: process.env.EHR_DB_PASSWORD,
    server: process.env.EHR_DB_SERVER,
    database: process.env.EHR_DB_DATABASE,
    options: {
        encrypt: true, // Use encryption for Azure SQL Server
        trustServerCertificate: true, // Change to false in production
    },
};

// API to fetch data from a specific table
app.get('/table/:table_name', async (req, res) => {
    const { table_name } = req.params;

    // Basic validation for table_name
    if (!/^[a-zA-Z0-9_]+$/.test(table_name)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    try {
        // Connect to the database
        const pool = await sql.connect(dbConfig);

        // Query the data
        const result = await pool.request().query(`SELECT * FROM ${table_name}`);
        
        // Send response
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(`Error querying table ${table_name}:`, err);
        res.status(500).json({ error: 'Database query failed' });
    } finally {
        // Close the connection
        sql.close();
    }
});

// Routes
app.use('/auth', authRoutes); // Các route liên quan đến auth (login/signup)

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
