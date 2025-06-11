const dotenv = require("dotenv");
const FileNotes = require("../Models/Notes");
const TextNotes = require("../Models/CreateNote");
const multer = require("multer");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// ************** geminiAI code *******
const generateContent = async (prompt) => {
    try {
        const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
        return result.response.text();
    } catch (error) {
        return "Error generating response.";
    }
};

createContent = async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question || question.trim() === "") {
            return res.status(400).json({ error: "Question cannot be empty" });
        }
        const result = await generateContent(question);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const storage = multer.memoryStorage();
var upload = multer({ storage: storage });
//uploadNote
const uploadNote = async (req, res) => {
    try {
      const fileName = req.body.title;
      const file = req.file.filename;
      const uploadedBy = req.user._id;
  
      const newFile = new FileNotes({
        fileName: fileName,
        file: file,
        uploadedBy: uploadedBy,
      });
      
      await newFile.save();
      res.send({ status: "Ok" });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};
//getNote
const getNote = async (req, res) => {
    try {
        const { title } = req.query;
        const userId = req.user._id;
        const query = {
            uploadedBy: userId,
        };

        if (title) {
            query.fileName = {
                $regex: title,  
                $options: "i" 
            };
        };
        const data = await FileNotes.find(query);
        res.send({ data: data });

    } catch (error) {
        console.log(error);
    }
};

//getNoteByID
const getNoteByID = async (req, res) => {
    try {
        const userId = req.user._id;
        const data = await FileNotes.find({ uploadedBy: userId });
        res.send({ data });

    } catch (error) {
        console.log(error);
    }
};

//addnote
const addNote = async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: true, message: "userId is required" });
        }
       
        if (!title) {
            return res.status(400).json({ error: true, message: "Title is required" });
        }

        if (!content) {
            return res.status(400).json({ error: true, message: "Content is required" });
        }
        const newNote = new TextNotes({
            title,
            content,
            userId,
        });
        await newNote.save();

        
        return res.json({
            error: false,
            note: newNote,
            message: "Note added successfully",
        });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
};

//edit note
const editNote = async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const noteId = req.params.noteId;

        if (!userId) {
            return res.status(400).json({ error: true, message: "userId is required" });
        }

        const note = await TextNotes.findOne({ _id: noteId, userId });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
};
// Delete Note
const deleteNote = async (req, res) => {
    const noteId = req.params.id;
    const { userId } = req.body;

    try {
        const note = await TextNotes.findOne({ _id: noteId, userId: userId });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await TextNotes.deleteOne({ _id: noteId, userId: userId });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server Error",
        });
    }
};

// Get all notes
const getAllNotes = async (req, res) => {
    const { userId } = req.query; 

    if (!userId) {
        return res.status(400).json({
          error: true,
          message: "userId is required in query parameters",
        });
      }
    
    try {
        const notes = await TextNotes.find({ userId: userId });

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server Error",
        });
    }
};


// Search Notes
const searchNotes = async (req, res) => {
    const { query, userId } = req.query; 
    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }
    if (!query) {
        return res.status(400).json({ error: true, message: "Search query is required" });
    }
    try {
        const matchingNotes = await TextNotes.find({
            userId: userId,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

const getHandwrittenNoteById = async (req, res) => {
    const { id } = req.params;

    try {
        const note = await TextNotes.findById(id);
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }   
        res.json({ error: false, note });
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
};

module.exports = { uploadNote, getNote, getNoteByID,
    getAllNotes, deleteNote, searchNotes, addNote, editNote, createContent,getHandwrittenNoteById};