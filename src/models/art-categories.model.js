const db = require('../utils/database');

module.exports = class ArtCategories {

  constructor(category_id, name, description, margin) {
    this.category_id = category_id;
    this.name = name;
    this.description = description;
    this.margin = margin;
  }

  static fetchAll() {
    return db.execute('SELECT * FROM category');
  }

  static post(name, description, margin) {
    return db.execute(
      'INSERT INTO category (name, description, margin) VALUES (?, ?, ?)',
      [name, description, margin]
    )
    .then(([result]) => {
      return { categoryId: result.insertId }; // Return the generated category ID
    });
  }

  static update(category_id, name, description, margin) {
    return db.execute(
      'UPDATE category SET name = ?, description = ?, margin = ? WHERE category_id = ?',
      [name, description, margin, category_id]
    )
    .then(() => {
      return { categoryId: category_id }; // Return the updated category ID
    });
  }

  static delete(category_id) {
    return db.execute('DELETE FROM category WHERE category_id = ?', [category_id]);
  }
}
