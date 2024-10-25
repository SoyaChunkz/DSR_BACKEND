const nodemailer = require('nodemailer');
const CombinedModel = require("../models/user.model");

//mail pdf
exports.handlePdfMail = async (req, res) => {
  const { email, body } = req.body;
  const pdfFile = req.file;
//   console.log("body " + email, body);

  console.log(req.body)
  try {
    // Find the user to get email credentials and department details
    const user = await CombinedModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("user found ", user)

    // Retrieve HOD and Principal emails
    const hod = await CombinedModel.findOne({
      role: 'HOD',
      departments: { $elemMatch: { name: req.body.selectedDept } }
    });

    // console.log(req.body.selectedDept);

    console.log("hod ", hod);
    if (!hod) {
      return res.status(404).json({ error: 'HOD not found' });
    }

    // Create Nodemailer transporter with the user's credentials
    const transporter = nodemailer.createTransport({
      service: process.env.MAILER_TRANSPORTER_SERVICE, // Replace with your email service
      auth: {
        user: process.env.MAILER_AUTH_ID , // Your email
        pass: process.env.MAILER_AUTH_PASS , // Your email password or app password
      },
    });

    // Email options, sending to logged-in user, HOD, and Principal
    const mailOptions = {
      from: process.env.MAILER_FROM_ID,
      to: user.email, // Send to the logged-in user
      cc: `${hod.email}`, // CC HOD and Principal
      subject: 'DSR Report',
      text: body,
      attachments: [
        {
          filename: pdfFile.originalname,
          content: pdfFile.buffer,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      // console.log('Email sent:', info.response);
      res.status(200).send('Email sent');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}