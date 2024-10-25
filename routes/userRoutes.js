const express = require('express');
const router = express.Router();
const { handleCreateAccount, handleLogin, handleUserInfo } = require('../controllers/userController')
const { authenticateToken } = require('../utilities/authenticateToken')

//route to create a new account
router.post('/create-account', handleCreateAccount);

//route to login
router.post('/login', handleLogin);

//get user info
router.get('/get-user', authenticateToken, handleUserInfo);

module.exports = router;