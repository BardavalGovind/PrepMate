const express = require('express');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const multer = require('multer');
const cloudinary = require('cloudinary');


dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
var upload = multer({
    storage: storage
})

//Signup route
const signup = async (req, res)=>{
    try{
        const { firstName, lastName, userEmail, userMobile, userName } = req.body;

        
        const existingUser = await User.findOne({ userEmail });
        if(existingUser){
            res.status(401).send("User Already exists with this email")
        }

        //check if file is provided
        if(!req.file){
            return res.status(400).json({ error: "No Profile Image Provided" });
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);

        const password = req.body.userPassword;
        const saltRounds = 10;

        const salt = await bcrypt.genSalt(saltRounds);

        const encryptedPassword = await bcrypt.hash(password, salt);
        console.log("Requested Body: ", req.body);

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

        return res.status(200).json({
            status: "Ok",
            user: newUser
        });

    }
    catch(error){
        res.status(400).json({ error: error.message });
        console.log(error);
    }
};


const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        const user = await User.findOne({ userEmail });

        if (user) {
            const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
            if (passwordMatch) {
                return res.json(user);
            } else {
                return res.json({ status: "Error", getUser: false })
            }
        } else {
            return res.json({ status: "Error", getUser: false });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { signup, login };