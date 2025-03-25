const jwt = require('jsonwebtoken');
const express = require('express');
const dotenv = require('dotenv');
const User = require('../Models/User');
const bcrypt = require("bcrypt");
const multer = require('multer');
const cloudinary = require('cloudinary');

dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
var upload = multer({
    storage: storage
});

const signup = async (req, res) => {
    try {
        const { firstName, lastName, userEmail, userMobile, userName } = req.body;

        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(401).json({ message: "User already exists with this email" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No Profile Image Provided" });
        }
        const result = await cloudinary.uploader.upload(req.file.path);

        const password = req.body.userPassword;
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            userEmail,
            userMobile,
            userName,
            userPassword: encryptedPassword,
            profileImage: result.secure_url
        });

        await newUser.save();

        res.status(201).json({
            status: "OK",
            message: "User registered successfully. Please login!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!passwordMatch) {
            return res.status(401).json({ status: "Error", message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { _id: user._id, userEmail: user.userEmail },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            status: "OK",
            message: "Login successful",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userEmail: user.userEmail,
                userMobile: user.userMobile,
                userName: user.userName,
                profileImage: user.profileImage
            },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { signup, login };