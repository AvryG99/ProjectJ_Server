const express = require('express');
const { login, signup, getUserInfo } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validateInputs');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

/**
 * @swagger
 * /node/auth/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 example: john_doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
router.post('/signup', validateSignup, signup); // processing Signup from middleware -> controller

/**
 * @swagger
 * /node/auth/login:
 *   post:
 *     summary: Login a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john_doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', validateLogin, login); // Login route

// Route riêng tư (chỉ truy cập khi có token)
router.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

/**
 * @swagger
 * /node/auth/user-info:
 *   get:
 *     summary: Get user info from JWT token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: john_doe
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User not found in token
 */
// Route mới để lấy thông tin người dùng
router.get('/user-info', authenticate, (req, res) => {
    const { username } = req.user; // Lấy username từ token
    if (!username) {
        return res.status(404).json({ message: 'User not found in token' });
    }
    res.status(200).json({ username });
});

module.exports = router;
