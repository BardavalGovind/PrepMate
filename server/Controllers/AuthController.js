const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    try {
        const { firstName, lastName, userEmail, userPassword } = req.body;

        if (!firstName || !lastName || !userEmail || !userPassword) {
            return res.status(400).json({ status: "Error", message: "All fields are required" });
        }
        if (firstName.length < 2 || lastName.length < 2) {
            return res.status(400).json({ status: "Error", message: "First and last names must be at least 2 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            return res.status(400).json({ status: "Error", message: "Invalid email format" });
        }

        if (userPassword.length < 6) {
            return res.status(400).json({ status: "Error", message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(200).json({ 
                status: "Exists", 
                message: "User already exists with this email. Please log in" });
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const newUser = new User({
            firstName,
            lastName,
            userEmail,
            userPassword: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            status: "OK",
            message: "User registered successfully. Please login!"
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
};


const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        if (!userEmail || !userPassword) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { _id: user._id, userEmail: user.userEmail },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userEmail: user.userEmail,
                profileImage: user.profileImage || null
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { signup, login };
