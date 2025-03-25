const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require("./routes/auth")
const noteRoutes = require("./routes/notes");
const Note = require("./models/CreateNote");

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connection is successful.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectDb();

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/files", express.static("files"));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
