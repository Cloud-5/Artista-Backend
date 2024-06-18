const db = require('../utils/database');

class Preference {
    static async showCategories() {
        return await db.execute('SELECT category_id, name,banner FROM category');
    }

    static async addPreference(user_id, category_ids) {
        const values = category_ids.map(category_id => `(${user_id}, ${category_id})`).join(',');
        const sql = `INSERT INTO preferences (user_id, category_id) VALUES ${values}`;
        return await db.execute(sql);
    }
};

exports.showPreference = async (req, res, next) => {
    try {
        const categories = await Preference.showCategories();
        res.status(200).json(categories[0]);
    } catch (error) {
        next(error);
    }
}

exports.addPreference = async (req, res, next) => {
    const { user_id, category_ids } = req.body;
    try {
        await Preference.addPreference(user_id, category_ids);
        res.status(201).json({ message: 'Preferences added successfully' });
    } catch (error) {
        next(error);
    }
}
