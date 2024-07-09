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
    // static upload2DArt()
}

module.exports = {ArtCategories,ArtCategoriesFormats,UploadArtwork};

