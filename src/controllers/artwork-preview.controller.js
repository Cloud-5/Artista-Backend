const ArtPreview = require('../services/artwork-preview.service');

exports.artworkPreview = async (req, res, next) => {
    const artId = req.params.artId;
    const userId = req.query.userId;
    if (!artId) {
        return res.status(400).json({ error: 'artId parameter is required' });
    }

    if (!userId) {
        return res.status(400).json({ error: 'userId query parameter is required' });
    }
    try {
        const artworkDetails = await ArtPreview.getArtDetails(artId, userId);
        const comments = await ArtPreview.getComments(artId);
        const artistId = artworkDetails[0][0].artist_id;
        const bestArtworks = await ArtPreview.getBestArtworks(artistId);
        const relatedArtworks = await ArtPreview.getRelatedArtworks(artId,userId);
        console.log('related',relatedArtworks);
        const responseData = {
            artworkDetails: artworkDetails[0],
            comments: comments[0],
            bestArtworks: bestArtworks[0],
            relatedArtworks: relatedArtworks[0]
        };
        res.status(200).json(responseData);
        console.log('response',responseData);
    } catch (error) {
        return res.status(400).json({ error: 'Error getting artwork details' });
    }
}

exports.likeArtwork = async (req, res, next) => {
    const artId = req.params.artId;
    const userId = req.body.userId;
    try {
        await ArtPreview.InsertLike(artId, userId);
        res.status(201).json({ message: 'Artwork liked successfully' });
    } catch (error) {
        console.error('Error liking artwork:', error);
        next(error);
    }
}

exports.unlikeArtwork = async (req, res, next) => {
    const artId = req.params.artId;
    const userId = req.body.userId;
    try {
        await ArtPreview.DeleteLike(artId, userId);
        res.status(200).json({ message: 'Artwork unliked successfully' });
    } catch (error) {
        console.error('Error unliking artwork:', error);
        next(error);
    }

}

exports.followArtist = async (req, res, next) => {
    const artistId = req.params.artistId;
    const customerId = req.body.userId;
    try {
        await ArtPreview.InsertFollow(customerId, artistId);
        res.status(201).json({ message: 'Artist followed successfully' });
    } catch (error) {
        console.error('Error following artist:', error);
        next(error);
    }
}

exports.unfollowArtist = async (req, res, next) => {
    const artistId = req.params.artistId;
    const customerId = req.body.userId;
    try {
        await ArtPreview.DeleteFollow(customerId, artistId);
        res.status(200).json({ message: 'Artist unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing artist:', error);
        next(error);
    }
}

exports.addToGallery = async (req, res, next) => {
    const artId = req.params.artId;
    const userId = req.body.userId;
    try {
        await ArtPreview.addToGallery(artId, userId);
        res.status(201).json({ message: 'Artwork added to gallery successfully' });
    } catch (error) {
        console.error('Error adding artwork to gallery:', error);
        next(error);
    }
}

exports.removeFromGallery = async (req, res, next) => {
    const artId = req.params.artId;
    const userId = req.body.userId;
    try {
        await ArtPreview.removeFromGallery(artId, userId);
        res.status(200).json({ message: 'Artwork removed from gallery successfully' });
    } catch (error) {
        console.error('Error removing artwork from gallery:', error);
        next(error);
    }

}

exports.postComment = async(req, res, next) => {
    const artId = req.params.artId;
    const userId = req.body.userId; 
    const content = req.body.content;
    try {
        const insertedComment = await ArtPreview.insertComment(artId, userId, content);
        const commentId = insertedComment.comment_id;
        const comment = await ArtPreview.getCommentById(commentId);
        res.status(201).json({ comment: comment });
    } catch (error) {
        console.error('Error posting comment:', error);
        next(error);
    }
}

exports.replyComment = async (req, res, next) => {
    const artId = req.params.artId;
    const userId = req.body.userId; 
    const content = req.body.content; 
    const parentId = req.params.parentId; 
    try {
        const reply = await ArtPreview.insertReply(artId, userId, content, parentId);
        const replyId = reply.comment_id;
        const comment = await ArtPreview.getCommentById(replyId);
        res.status(201).json({ comment : comment});
    } catch (error) {
        console.error('Error replying to comment:', error);
        next(error);
    }
}

exports.editComment = async (req, res, next) => {
    const commentId = req.params.commentId;
    const content = req.body.content; 
    try {
        const updatedComment = await ArtPreview.updateComment(commentId, content);
        const updatedcommentId = updatedComment.comment_id;
        const comment = await ArtPreview.getCommentById(updatedcommentId);
        res.status(200).json({ comment: comment });
    } catch (error) {
        console.error('Error editing comment:', error);
        next(error);
    }
}

exports.deleteComment = async (req, res, next) => {
    const commentId = req.params.commentId;
    try {
        await ArtPreview.deleteComment(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        next(error);
    }
}


