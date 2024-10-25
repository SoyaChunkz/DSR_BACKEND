const express = require('express');
const router = express.Router();
const { handleCreateDepartment, handleAllDepartments, handleUpdateDepartment, handleDeleteDepartment, handleDeleteLab, handleDeleteSection } = require('../controllers/departmentPanelController')
const { authenticateToken } = require('../utilities/authenticateToken')


//route to add a new department
router.post('/create-department-structure', authenticateToken, handleCreateDepartment);

//route to get all departments
router.get('/get-all-departments', authenticateToken, handleAllDepartments);

//route to edit an existing department
router.put('/edit-department/:department_id', authenticateToken, handleUpdateDepartment);

//route to delete a department
router.delete('/delete-department/:department_id', authenticateToken, handleDeleteDepartment);

//route to delete a lab
router.delete('/delete-lab/:department_id/:lab_id', authenticateToken, handleDeleteLab);

//route to delete a section
router.delete('/delete-section/:department_id/:lab_id/:section_id', authenticateToken, handleDeleteSection);

module.exports = router