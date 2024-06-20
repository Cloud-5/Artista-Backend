const db = require('../utils/database');

class GetCategories {
    static async fetchAll() {
        try {
            const categories = await db.execute(`
                SELECT 
                    name
                FROM 
                    category
            `);

            return categories[0]; // Assuming db.execute returns an array with the result in the first element
        } catch (error) {
            throw error; // Throw the error to be caught by the caller
        }
    }
}

exports.fetchAll = async (req, res, next) => {
    try {
        const categories = await GetCategories.fetchAll(); // Use the class method correctly

        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}

module.exports = GetCategories;
