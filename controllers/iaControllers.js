const { getAIResponse } = require('../services/iaService');
const getResponse = async (req, res) => {
    try {
        const { subject, topic, level } = req.body;

        const data = await getAIResponse({ subject, topic, level });

        res.json(data);
    } catch (error) {
        console.error('Error getting AI response: ', error);
        res.status(500).json({ error: 'Error getting AI response' });
    }
};

module.exports = { getResponse };