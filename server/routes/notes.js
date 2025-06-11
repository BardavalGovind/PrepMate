const express = require("express");
const router = express.Router();
const NotesController = require("../Controllers/NotesController");
const multer = require("multer");
const authMiddleware = require('../middleware/authMiddleware');

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
router.post("/upload", authMiddleware, upload.single("file"), NotesController.uploadNote);
router.get("/getFiles", authMiddleware, NotesController.getNote);
router.get("/getFiles/:id", authMiddleware, NotesController.getNoteByID);

router.post("/add-note", authMiddleware, NotesController.addNote);
router.put("/edit-note/:noteId", authMiddleware, NotesController.editNote);
router.get("/get-all-notes", authMiddleware, NotesController.getAllNotes);
router.get("/search-notes", authMiddleware, NotesController.searchNotes);
router.delete("/delete-note/:id", authMiddleware, NotesController.deleteNote);
router.post("/AIcontent", authMiddleware, NotesController.createContent);
router.get("/get-handwritten-note/:id", authMiddleware, NotesController.getHandwrittenNoteById);

module.exports = router;