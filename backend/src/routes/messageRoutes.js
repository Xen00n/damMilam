import express from 'express';
import Message from '../models/Message.js';
import Group from '../models/Group.js';

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

// Fetch group data by ID
router.get('/groups/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({
      groupName: group.groupName,  // Assuming 'groupName' is a field in the Group model
    });
  } catch (err) {
    console.error('Error fetching group data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;