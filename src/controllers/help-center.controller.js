const helpCenterService = require('../services/help-center.service.js');

exports.submitComplaint = async (req, res) => {
    try {
        console.log(req.body,'req body in controller')
        const { userId, categoryId, subject, description } = req.body;
        const result = await helpCenterService.submitComplaint(userId, categoryId, subject, description);
        res.status(200).json({ message: 'Complaint submitted successfully.', result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit complaint.' });
    }
};


exports.getCategories = async (req, res) => {
    try {
        const [categories] = await helpCenterService.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch complaint categories.' });
    }
};