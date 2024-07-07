const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post('/upload', upload.fields([
  { name: 'artworkFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 },
  { name: 'backgroundFile', maxCount: 1 },
]), async (req, res) => {
  const { title, price, category, description, tags, artworkType } = req.body;

  const uploadFileToS3 = (file, folder) => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${folder}/${uuidv4()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return s3.upload(params).promise();
  };

  try {
    const artworkFile = req.files.artworkFile[0];
    const artworkUpload = await uploadFileToS3(artworkFile, 'artworks');
    const artworkUrl = artworkUpload.Location;

    let thumbnailUrl = null;
    if (req.files.thumbnailFile) {
      const thumbnailFile = req.files.thumbnailFile[0];
      const thumbnailUpload = await uploadFileToS3(thumbnailFile, 'thumbnails');
      thumbnailUrl = thumbnailUpload.Location;
    }

    let backgroundUrl = null;
    if (req.files.backgroundFile) {
      const backgroundFile = req.files.backgroundFile[0];
      const backgroundUpload = await uploadFileToS3(backgroundFile, 'backgrounds');
      backgroundUrl = backgroundUpload.Location;
    }

    // Save details in the database
    const artwork = new Artwork({
      title,
      price,
      category,
      description,
      tags: tags.split(','),
      artworkType,
      artworkUrl,
      thumbnailUrl,
      backgroundUrl,
    });
    await artwork.save();

    res.status(201).json({ message: 'Artwork uploaded successfully', artwork });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload artwork', details: error });
  }
});

module.exports = router;
