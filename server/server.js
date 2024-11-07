const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/stt', require('./routes/stt'));  // Speech-to-Text API route
app.use('/api/tts', require('./routes/tts'));  // Text-to-Speech API route

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
