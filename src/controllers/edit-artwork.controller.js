const { editArtwork, edittools, editTags, editFormts } = require('../services/edit-artwork.service');


exports.fetchArtwork = async (req, res, next) => {
    const artwork_id = req.params.artwork_id;
    console.log(artwork_id, 'edit art');
    this.newArtworkId=artwork_id;
    try {
        const [artwork] = await editArtwork.getArtwork(artwork_id);
        console.log('editing artwork', artwork);
        return res.status(200).json({ artwork: artwork[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getArtworkIs3D = async (req, res) => {
    const artwork_id = req.params.artwork_id;
    console.log(artwork_id, 'edit arttttttttttttt');    
    try {
        const [result] = await editArtwork.getArtworkIs3D(artwork_id);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        const { is3D } = result[0];
        return res.status(200).json({ artwork_id, is3D });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateArtwork2D = async(req, res, next)=>{
    try {
        const artwork_id = req.params.artwork_id;
        const {title, price, thumbnail_url, description, category_id, is3D} = req.body;

        const updatedArtwork = await editArtwork.update2d(
            artwork_id,title, price, thumbnail_url, description, category_id, is3D
        );
        return res.status(200).json({message: "Artwork updated successfully"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

exports.updateArtwork3D = async(req,res,next) => {
    try {
        const artwork_id = req.params.artwork_id;
        const {title, price, thumbnail_url, description, category_id, is3D, subfolder_name, modelBackground, original_url} = req.body;

        const updateArtwork = await editArtwork.update3D(
            artwork_id, title, price, thumbnail_url, description, category_id, is3D, subfolder_name, modelBackground, original_url
        )
        return res.status(200).json({message: "Artwork updated successfully"})
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}
