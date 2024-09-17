const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Register a new user
exports.signUp = async (req, res) => {
    const { email, password, first_name,last_name,phone_no  } = req.body;
    if(!first_name || !last_name || !phone_no || !email || !password) {
        return res.status(400).json({ msg: 'Fill in neccessary details' });
    }
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ email, password, first_name,last_name,phone_no });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(201).json({ msg: 'User registered successfully' , token, user});
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({ token, user, msg: "User logged In Successfully"});
};

// Forgot password - send reset code
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: 'User not found' });
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetCode = resetCode;
    await user.save();

    await sendEmail(user.email, 'Password Reset Code', `Your reset code is ${resetCode}`);

    res.status(200).json({ msg: 'Reset code sent to email' });
};

// Verify reset code
exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;
    let user = await User.findOne({ email, resetCode: code });
    if (!user) {
        return res.status(400).json({ msg: 'Invalid code' });
    }

    user.isVerified = true;
    user.resetCode = null;
    await user.save();

    res.status(200).json({ msg: 'Code verified. You can now reset your password' });
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email, isVerified: true });
    if (!user) {
        return res.status(400).json({ msg: 'User not found or not verified' });
    }

    user.password = password;
    user.isVerified = false;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
};
