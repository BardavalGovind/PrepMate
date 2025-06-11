const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
module.exports = mongoose.model("FileNotes", NoteSchema);