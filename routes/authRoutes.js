const express = require('express');
const { login, signup } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validateInputs');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         username: mycute
 *         email: mycute@gm.medi.com
 *         password: 123456789
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
router.post('/signup', validateSignup, signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /auth/user-info:
 *   get:
 *     summary: Get user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user info
 *       401:
 *         description: Unauthorized
 */
router.get('/user-info', authenticate, (req, res) => {
    const { username } = req.user; // Lấy username từ token
    if (!username) {
        return res.status(404).json({ message: 'User not found in token' });
    }
    res.status(200).json({ username });
});

module.exports = router;
// http://localhost:5000/api-docs