const express = require("express");
const router = express.Router();
const NotesController = require("../Controllers/NotesController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = "./files";
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({
    storage: storage
});

// Routes
router.post("/upload", upload.single("file"), NotesController.uploadNote);
router.get("/getFiles", NotesController.getNote);
router.get("/getFiles/:id", NotesController.getNoteByID);
router.post("/add-note", NotesController.addNote);
router.put("/edit-note/:noteId", NotesController.editNote);
router.get("/get-all-notes", NotesController.getAllNotes);
router.get("/search-notes", NotesController.searchNotes);
router.delete("/delete-note/:id", NotesController.deleteNote);
router.post("/AIcontent", NotesController.createContent);


module.exports = router;