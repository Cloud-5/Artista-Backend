const express = require('express');
const router = express.Router();
const artworkPreviewController = require('../controllers/artwork-preview.controller');

router.get('/:artId', artworkPreviewController.artworkPreview);
router.post('/:artId/like', artworkPreviewController.likeArtwork);
router.post('/:artId/unlike', artworkPreviewController.unlikeArtwork);
router.post('/:artistId/follow', artworkPreviewController.followArtist);
router.post('/:artistId/unfollow', artworkPreviewController.unfollowArtist);
router.post('/:artId/addtogallery', artworkPreviewController.addToGallery);
router.post('/:artId/removefromgallery', artworkPreviewController.removeFromGallery);
router.post('/:artId/comment', artworkPreviewController.postComment);
router.post('/:artId/comment/:parentId/reply', artworkPreviewController.replyComment);
router.put('/comment/:commentId', artworkPreviewController.editComment);
router.delete('/comment/:commentId', artworkPreviewController.deleteComment);

module.exports = router;