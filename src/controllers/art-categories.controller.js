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

class ArtCategoriesFormats {
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

exports.fetchAll = async (req, res, next) => {
  try {
    // Fetch all categories
    const categories = await ArtCategories.fetchAll();

    // Map over the categories and fetch associated formats the category
    const categoriesWithFormats = await Promise.all(
      categories[0].map(async (category) => {
        const formats = await ArtCategoriesFormats.fetchAll(category.category_id);
        return {
          ...category,
          formats: formats[0],
        };
      })
    );

    res.status(200).json(categoriesWithFormats);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  const { name, description, margin, formats } = req.body;

  try {
    // Create category
    const categoryResult = await ArtCategories.post(name, description, margin);

    // Get the generated category ID
    const categoryId = categoryResult.categoryId;

    console.log('Received formats:', formats);

    // Create formats associated with the category
    const formatPromises = formats.map(format => {
      console.log('categoryId:', categoryId);
      console.log('format_name:', format.format_name);
      return ArtCategoriesFormats.post(categoryId, format.format_name);
    });

    // Wait for all format insertions to complete
    await Promise.all(formatPromises);

    res.status(201).json({ message: 'Category created successfully!', categoryId });
  } catch (error) {
    console.error('Error creating category:', error);
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const { name, description, margin, formats } = req.body;

  try {
    // Update category
    await ArtCategories.update(categoryId, name, description, margin);

    // Update or insert new formats associated with the category
    const existingFormats = await ArtCategoriesFormats.fetchAll(categoryId);
    
    // Identify which formats need to be updated and which ones need to be inserted
    const updatePromises = formats.map(async format => {
      if (format.format_id && existingFormats[0].some(existingFormat => existingFormat.format_id === format.format_id)) {
        // Update existing format
        await ArtCategoriesFormats.update(format.format_id, categoryId, format.format_name);
      } else {
        // Insert new format
        await ArtCategoriesFormats.post(categoryId, format.format_name);
      }
    });

    // Wait for all update and insert operations to complete
    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Category updated successfully!', categoryId });
  } catch (error) {
    console.error('Error updating category:', error);
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    // Delete category
    await ArtCategories.delete(categoryId);

    // Delete associated supported formats
    await ArtCategoriesFormats.deleteByCategoryId(categoryId);

    res.status(200).json({ message: 'Category and associated formats deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
