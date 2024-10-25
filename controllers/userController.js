const CombinedModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

//create account
exports.handleCreateAccount = async (req, res) => {
    const { fullName, email, password, role, departments } = req.body;

    try {
        // Basic validation
        if (!fullName) {
          return res
            .status(400)
            .json({
              error: true,
              message: "Full Name is required"
            });
        }
        if (!email) {
          return res
            .status(400)
            .json({
              error: true,
              message: "Email is required"
            });
        }
        if (!password) {
          return res
            .status(400)
            .json({
              error: true,
              message: "Password is required"
            });
        }
        if (!role) {
          return res
            .status(400)
            .json({
              error: true,
              message: "Role is required"
            });
        }
    
        // Check if the user already exists
        const isUser = await CombinedModel.findOne({ email });
        if (isUser) {
          return res.json({
            error: true,
            message: 'User already exists'
          });
        }
    
        // Create a new user based on the CombinedModel schema
        const newUser = new CombinedModel({
          fullName,
          email,
          password,
          role,
          departments
        });
    
        // Save the user to the database
        await newUser.save();
    
        // Generate JWT access token
        const accessToken = jwt.sign({ user: newUser }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '36000m'
        });
    
        // Respond with success message and user details
        return res.json({
          error: false,
          user: newUser,
          accessToken,
          message: 'Registration Successful'
        });
      } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({
          error: true,
          message: 'Internal Server Error'
        });
      }
}

//login
exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  const userInfo = await CombinedModel.findOne({
    email: email,
  });

  if (!userInfo) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = {
      user: userInfo,
    };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successfull",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
}

//get user info
exports.handleUserInfo = async (req, res) => {
    try {
        const user = await CombinedModel.findById(req.user.user._id).select('-password');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}