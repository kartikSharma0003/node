const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
    }
});

const upload = multer({ storage: storage });

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to upload image
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 0, msg: 'No file uploaded' });
        }
        res.status(200).json({ status: 1, msg: 'File uploaded successfully', file: req.file });
    } catch (error) {
        res.status(500).json({ status: 0, msg: 'Server error', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
