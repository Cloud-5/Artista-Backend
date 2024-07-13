const db = require('../utils/database');

class ArtCategories {
    constructor(category_id, name, description, margin) {
      this.category_id = category_id;
      this.name = name;
      this.description = description;
      this.margin = margin;
    }
  
    static fetchAll() {
      return db.execute('SELECT * FROM category');
    }
}
class ArtCategoriesFormats {
    constructor(format_id, category_id, format_name) {
      this.format_id = format_id;
      this.category_id = category_id;
      this.format_name = format_name;
    }
  
    static fetchSupportedFormats(category_id) {
      return db.execute('SELECT * FROM supported_formats WHERE category_id = ?', [category_id]);
    }
}

class UploadArtwork {
    static upload2DArt(artist,title,price,thumbnail_url,description,category_id,is3D){
        return db.execute('INSERT INTO artwork (artist_id,title,price,thumbnail_url,description,category_id,is3D) VALUES (?,?,?,?,?,?,?)',
            [artist,title,price,thumbnail_url,description,category_id,is3D])
            .then(([result])=> {
                return {artworkId: result.insertId};
            });
    }
    static upload3DArt(artist,title,price,thumbnail_url,description,category_id,is3D,subfolder_name, modelBackground,original_url){
        return db.execute('INSERT INTO artwork (artist_id,title,price,thumbnail_url,description,category_id,is3D,subfolder_name, modelBackground,original_url) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [artist,title,price,thumbnail_url,description,category_id,is3D,subfolder_name, modelBackground,original_url])
            .then(([result])=> {
                return {artworkId: result.insertId};
            });
    }
}

class ArtworkTags{
    static addTags(artworkId, tag_name){
        return db.execute('Insert into artwork_tag (artwork_id,tag_name) values (?,?)',[artworkId,tag_name]);
    }
}
class ArtworkTools {
    static addTool(artworkId, tool_name) {
      return db.execute('INSERT INTO artwork_tool (artwork_id, tool_name) VALUES (?, ?)', [artworkId, tool_name]);
    }
  }
  
  class ArtworkFileFormats {
    static addFileFormat(artworkId, file_format_name) {
      return db.execute('INSERT INTO artwork_file_format (artwork_id, file_format_name) VALUES (?, ?)', [artworkId, file_format_name]);
    }
  }

module.exports = {ArtCategories,ArtCategoriesFormats,UploadArtwork,ArtworkTags,ArtworkTools,ArtworkFileFormats};

