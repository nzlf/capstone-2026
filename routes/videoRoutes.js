const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Endpoint Admin unggah video: POST /api/videos
router.post('/', videoController.uploadVideo);

// Endpoint Klien kirim komentar revisi: POST /api/videos/comments
router.post('/comments', videoController.addRevisionComment);

module.exports = router;