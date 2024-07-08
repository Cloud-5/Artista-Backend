const db = require('../utils/database');

class Personalize {
    static async getUserPreferences(user_id) {
        return await db.execute(`
        SELECT 
        c.category_id,
        c.name,
        c.banner,
        CASE WHEN p.user_id IS NOT NULL THEN 1 ELSE 0 END AS selected
    FROM 
        category c
    LEFT JOIN 
        preferences p ON c.category_id = p.category_id AND p.user_id = ?;`, [user_id]);
    }

    static async updatePreferences(user_id, new_category_ids) {
        await db.execute('DELETE FROM preferences WHERE user_id = ?', [user_id]);

        if (new_category_ids.length > 0) {
            const values = new_category_ids.map(category_id => `('${user_id}', ${category_id})`).join(',');
            const sql = `INSERT INTO preferences (user_id, category_id) VALUES ${values}`;
            await db.execute(sql);
        }
    }
}


exports.showUserPreferences = async (req, res, next) => {
    const user_id = req.params.user_id; // Assuming user_id is part of the route

    try {
        const userPreferences = await Personalize.getUserPreferences(user_id);
        res.status(200).json(userPreferences[0]);
    } catch (error) {
        next(error);
    }
}

exports.updatePreferences = async (req, res, next) => {
    const user_id = req.params.user_id; // Assuming user_id is part of the route
    const { new_category_ids } = req.body;

    try {
        await Personalize.updatePreferences(user_id, new_category_ids);
        res.status(200).json({ message: 'Preferences updated successfully' });
    } catch (error) {
        next(error);
}
}