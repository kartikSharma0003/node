// controllers/uploadController.js
const multer = require('multer');
const path = require('path');
const Image = require('../models/uploadimage.js'); // Adjust the path to your Image model

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
    }
});

const upload = multer({ storage: storage }).single('image');

// Function to handle image upload and saving metadata
async function uploadImage(req, res) {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ status: 0, msg: 'Multer error', error: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ status: 0, msg: 'No file uploaded' });
            }

            // Create a new image record in the database
            const newImage = new Image({
                filename: req.file.filename,
                path: req.file.path,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                userId: req.body.userId // or however you obtain the user ID
            });

            // Save the image record
            await newImage.save();

            res.status(200).json({ status: 1, msg: 'File uploaded and metadata saved successfully', file: req.file });
        } catch (error) {
            console.error("Error during file upload and metadata saving:", error);
            res.status(500).json({ status: 0, msg: 'Server error', error: error.message });
        }
    });
}

module.exports = { uploadImage };
