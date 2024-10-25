const express = require('express');
const router = express.Router();
const { handleAllEntries, handleAddNewEntry, handleUpdateEntry, handleDeleteEntry } = require('../controllers/dsrController')
const { authenticateToken } = require('../utilities/authenticateToken')

//route to get all entries
router.get('/get-all-entries', authenticateToken, handleAllEntries);

//route to add new entry
router.post('/add-dsr-entry', authenticateToken, handleAddNewEntry);

//route to update existing entry
router.put('/update-dsr-entry/:entryId', authenticateToken, handleUpdateEntry);

//route to delete an entry
router.delete('/delete-dsr-entry/:entryId', authenticateToken, handleDeleteEntry);

module.exports = router