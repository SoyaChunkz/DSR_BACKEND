const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { handlePdfMail } = require('../controllers/pdfMaiController')

//route to mail pdf
router.post('/send-email', upload.single('attachment'), handlePdfMail)

module.exports = router