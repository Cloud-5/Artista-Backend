const db = require('../utils/database');

module.exports = class ArtCategoriesFormats {

  constructor(format_id, category_id, format_name) {
    this.format_id = format_id;
    this.category_id = category_id;
    this.format_name = format_name;
  }

  static fetchAll(category_id) {
    return db.execute('SELECT * FROM supported_formats WHERE category_id = ?', [category_id]);
  }

  static post(category_id, format_name) {
    return db.execute(
      'INSERT INTO supported_formats (category_id, format_name) VALUES (?, ?)',
      [category_id, format_name]
    );
  }

  static update(format_id, category_id, format_name) {
    return db.execute(
      'UPDATE supported_formats SET category_id = ?, format_name = ? WHERE format_id = ?',
      [category_id, format_name, format_id]
    );
  }

  static deleteByCategoryId(category_id) {
    return db.execute('DELETE FROM supported_formats WHERE category_id = ?', [category_id]);
  }
  
  static delete(format_id) {
    return db.execute('DELETE FROM supported_formats WHERE format_id = ?', [format_id]);
  }
}
