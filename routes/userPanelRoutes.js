const express = require('express');
const router = express.Router();
const { handleAllUsers, handleCreateUser, handleUpdateUser, handleDeleteUser, handleAllDepartments } = require('../controllers/userPanelController')
const { authenticateToken } = require('../utilities/authenticateToken')

//route to get all users
router.get('/get-all-users', authenticateToken, handleAllUsers);

//route to add new user
router.post('/add-user', authenticateToken, handleCreateUser);

//route to edit user
router.put('/edit-user/:id', authenticateToken, handleUpdateUser);

//route to delete a user
router.delete('/delete-user/:id', authenticateToken, handleDeleteUser);

//route to get all departments
router.get('/get-departments', authenticateToken, handleAllDepartments);

module.exports = router
