
const {ArtCategories,ArtCategoriesFormats, UploadArtwork, ArtworkTags,  ArtworkTools, ArtworkFileFormats} = require('../services/artist-upload-artwork.service');

// exports.uploadArtwork = async (req, res, next) => {
//   try {
//     const artworkFile = req.files.artworkFile[0];
//     const artworkUpload = await uploadFileToS3(artworkFile, 'artworks');
//     const artworkUrl = artworkUpload.Location;

//     res.status(201).json({ message: 'Artwork uploaded successfully', artworkUrl });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getArtworkDetails = async (req, res, next) => {
//   const artworkId = req.params.artworkId;
//   try {
//     const artworkDetails = await getArtwork(artworkId);
//     if (!artworkDetails) {
//       return res.status(404).json({ message: 'Artwork not found' });
//     }
//     res.status(200).json(artworkDetails);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.deleteArtwork = async (req, res, next) => {
//   const artworkId = req.params.artworkId;
//   try {
//     await deleteArtwork(artworkId);
//     res.status(200).json({ message: 'Artwork deleted successfully' });
//   } catch (error) {
//     next(error);
//   }
// };


// exports.getCategories = async (req, res, next) => {
//     try {
//       const categories = await artistUploadArtworks.getCategories();
//       res.status(200).json(categories);
//     } catch (error) {
//       next(error);
//     }
//   };

  exports.fetchAll = async (req, res, next) => {
    try {
        const categories = await ArtCategories.fetchAll();
  
        const categoriesWithFormats = await Promise.all(
            categories[0].map(async (category) => {
                const formats = await ArtCategoriesFormats.fetchSupportedFormats(category.category_id);
                return {
                    ...category,
                    formats: formats[0] 
                };
            })
        );
  
        res.status(200).json(categoriesWithFormats);
    } catch (error) {
        next(error);
    }
  };

exports.upload2DArtwork = async (req, res, next) => {
  const { artist,title,price,thumbnail_url,description,category_id,is3D, tag_name, tools, fileFormats } = req.body;
  try {
      console.log('artist',artist);
    const result2D = await UploadArtwork.upload2DArt(artist,title,price,thumbnail_url,description,category_id,is3D);

    const artworkId = result2D.artworkId;

    const tagsPromises = tag_name.map(tag => {
        return ArtworkTags.addTags(artworkId,tag.tag_name);
    });
    const toolsPromises = tools.map(tool => {
        return ArtworkTools.addTool(artworkId, tool.tool_name);
    });
  
    const fileFormatsPromises = fileFormats.map(format => {
        return ArtworkFileFormats.addFileFormat(artworkId, format.file_format_name);
    });


    await Promise.all([...tagsPromises, ...toolsPromises, ...fileFormatsPromises]);
    //await Promise.all(tagsPromises);
    res.status(201).json({message: '2D Artwork uploaded successfully', artworkId});
  } catch (error) {
      console.error('Error uploading 2D artwork');
      next(error);
  }
}

exports.upload3DArtwork = async (req, res, next) => {
    const { artist,title,price,thumbnail_url,description,category_id,is3D, subfolder_name, modelBackground, original_url, tag_name, tools, fileFormats } = req.body;
    try {
        const result3D = await UploadArtwork.upload3DArt(artist,title,price,thumbnail_url,description,category_id,is3D,subfolder_name, modelBackground,original_url);
  
        const artworkId = result3D.artworkId;
  
        const tagsPromises = tag_name.map(tag => {
            return ArtworkTags.addTags(artworkId,tag.tag_name);
        });
        const toolsPromises = tools.map(tool => {
            return ArtworkTools.addTool(artworkId, tool.tool_name);
        });
      
        const fileFormatsPromises = fileFormats.map(format => {
            return ArtworkFileFormats.addFileFormat(artworkId, format.file_format_name);
        });
  
  
        await Promise.all([...tagsPromises, ...toolsPromises, ...fileFormatsPromises]);
        res.status(201).json({message: '3D Artwork uploaded successfully', artworkId});
    } catch (error) {
        console.error('Error uploading 3D artwork');
        next(error);
    }
}