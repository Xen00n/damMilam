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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch group data by ID
router.get('/groups/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate('access.userId', 'name');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Format access roles
    const accessRoles = group.access.map((accessEntry) => ({
      userId: accessEntry.userId._id,
      userName: accessEntry.userId.name,
      role: accessEntry.role || 'buyer', // Default role
    }));

    res.json({
      groupName: group.groupName,
      productId: group.productId,
      access: accessRoles,
    });
  } catch (err) {
    console.error('Error fetching group data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
