const nodemailer = require('nodemailer');
const CombinedModel = require("../models/user.model");
const Department = require("../models/dsr.model");


//get all users
exports.handleAllUsers = async (req, res) => {
    try {
        // console.log("2")
        const users = await CombinedModel.find();
        // console.log(users);
        res.json(users);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

//add new user
exports.handleCreateUser = async (req, res) => {
    const { fullName, email, password, role, department, labs } = req.body;

    // console.log('1');
    console.log(req.body);
    // console.log(labs);

    try {
        // Create the new user with the nested structure
        const newUser = new CombinedModel({
            fullName,
            email,
            password,
            role,
            departments: [
                {
                    name: department,
                    labs: labs.map(lab => ({
                        name: lab.labName,
                        sections: lab.sections.map(section => ({ name: section }))
                    }))
                }
            ]
        });

        // console.log(newUser);

        // console.log(newUser.departments[0].labs[0]);

        await newUser.save();

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: process.env.MAILER_TRANSPORTER_SERVICE, // Replace with your email service
            auth: {
                user: process.env.MAILER_AUTH_ID, // Your email
                pass: process.env.MAILER_AUTH_PASS, // Your email password or app password
            },
        });

        // Construct email body including lab and section details
        let labsAndSections = '';
        newUser.departments.forEach(dept => {
            dept.labs.forEach(lab => {
                labsAndSections += `Lab: ${lab.name}\nSections: ${lab.sections.map(section => section.name).join(', ')}\n\n`;
            });
        });

        // Send email with new user details
        const mailOptions = {
            from: process.env.MAILER_FROM_ID, // Sender address
            to: newUser.email, // User's email
            subject: 'Welcome! Your New Account Has Been Created', // Subject line
            text: `Hello ${newUser.fullName},\n\nYour account has been successfully created.\n\nHere are your account details:\n\nFull Name: ${newUser.fullName}\nEmail: ${newUser.email}\nPassword: ${password}\nRole: ${newUser.role}\n${newUser.role !== 'Admin'
                ? `Department: ${newUser.departments.map(dept => dept.name).join(', ')}\n\nLabs and Sections:\n${labsAndSections}\n`
                : ''
                }To log in to the DSR system, please use the above credentials and link:\n\nLogin Link: https://dsr-three.vercel.app\n\nFor any queries, please contact the admin at systems.dsr@gmail.com.\n\nBest regards,\nVidyalankar Institute Of Technology.\n\nThis is an auto-generated email. Please do not reply to this email.`, // Plain text body
        };


        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
    }
}

//edit an existing user
exports.handleUpdateUser = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, password, role, department, labs } = req.body;

    // console.log(req.body);
    // console.log(labs);

    try {
        // Create the updated data structure
        const updatedData = {
            fullName,
            email,
            password,
            role,
            departments: [
                {
                    name: department,
                    labs: labs.map(lab => ({
                        name: lab.labName,
                        sections: lab.sections.map(section => ({ name: section }))
                    }))
                }
            ]
        };

        // console.log(updatedData);

        // Update the user in the database
        const updatedUser = await CombinedModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: process.env.MAILER_TRANSPORTER_SERVICE, // Replace with your email service
            auth: {
                user: process.env.MAILER_AUTH_ID, // Your email
                pass: process.env.MAILER_AUTH_PASS, // Your email password or app password
            },
        });

        // Construct email body including lab and section details
        let labsAndSections = '';
        updatedUser.departments.forEach(dept => {
            dept.labs.forEach(lab => {
                labsAndSections += `Lab: ${lab.name}\nSections: ${lab.sections.map(section => section.name).join(', ')}\n\n`;
            });
        });

        // Send email with updated user details
        const mailOptions = {
            from: process.env.MAILER_FROM_ID, // Sender address
            to: updatedUser.email, // User's email
            subject: 'Your Details Have Been Updated', // Subject line
            text: `Hello ${updatedUser.fullName},\n\nYour account has been successfully updated.\n\nHere are your updated details:\n\nFull Name: ${updatedUser.fullName}\nEmail: ${updatedUser.email}\nPassword: ${password}\nRole: ${updatedUser.role}\n${updatedUser.role !== 'Admin'
                ? `Department: ${updatedUser.departments.map(dept => dept.name).join(', ')}\n\nLabs and Sections:\n${labsAndSections}\n`
                : ''
                }To log in to the DSR system, please use the above credentials and link:\n\nLogin Link: https://dsr-three.vercel.app\n\nFor any queries, please contact the admin at systems.dsr@gmail.com.\n\nBest regards,\nVidyalankar Institute Of Technology.\n\nThis is an auto-generated email. Please do not reply to this email.`, // Plain text body
        };


        // Send the email
        await transporter.sendMail(mailOptions);

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
}

//delete a user
exports.handleDeleteUser = async (req, res) => {
    try {
        await CombinedModel.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

//get all departments
exports.handleAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find({});
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}