const db = require('../utils/database');

class Preference {
    static async showPreference() {
        return await db.execute('SELECT category_id, name, image_url FROM category');
    }
};

exports.showPreference = async (req, res, next) => {
   try {
        const preference = await Preference.showPreference();
        res.status(200).json(preference[0]);
    } catch (error) {
        next(error);
    }
}
