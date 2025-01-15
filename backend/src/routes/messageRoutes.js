import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Fetch messages for a group
router.get('/messages/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ groupId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send('Server error');
  }
});

export default router;
