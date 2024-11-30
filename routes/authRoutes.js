const express = require('express');
const { login, signup } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validateInputs');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();



router.post('/signup', validateSignup, signup);


router.post('/login', validateLogin, login);


router.get('/user-info', authenticate, (req, res) => {
    const { username } = req.user; // Lấy username từ token
    if (!username) {
        return res.status(404).json({ message: 'User not found in token' });
    }
    res.status(200).json({ username });
});

module.exports = router;
