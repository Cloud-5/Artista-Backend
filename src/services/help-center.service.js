const db=require('../utils/database');

class ComplaintService {
    static submitComplaint(userId, categoryId, subject, description) {
        return db.execute(
            'INSERT INTO complaint (user_id, category_id, subject, description) VALUES (?, ?, ?, ?)',
            [userId, categoryId, subject, description]
        );
    }

    static getCategories() {
        return db.execute('SELECT category_id, category_name FROM complaint_category');
    }


}
module.exports = ComplaintService;