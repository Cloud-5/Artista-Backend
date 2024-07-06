const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Define route to upload artwork
router.post('/upload', upload.fields([
  { name: 'artworkFile', maxCount: 1 }
]), artworkController.uploadArtwork);

// Define route to get artwork details by artwork's ID
router.get('/:artworkId', artworkController.getArtworkDetails);

// Define route to delete artwork by artwork's ID
router.delete('/:artworkId', artworkController.deleteArtwork);

module.exports = router;
