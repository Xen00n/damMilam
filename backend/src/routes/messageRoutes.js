import express from 'express';
import Message from '../models/Message.js';
import Group from '../models/Group.js';

const router = express.Router();

// Fetch messages for a group
router.get('/messages/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    // Fetch messages for the given group ID and sort by timestamp
    const messages = await Message.find({ groupId }).sort({ timestamp: 1 });

    // Format the messages to include sender role, text, group ID, user ID, and timestamp
    const formattedMessages = messages.map((msg) => ({
      senderRole: msg.senderRole, // Assuming this field exists in the Message model
      senderId: msg.senderId,    // Assuming senderId exists in the Message model
      text: msg.text,            // The message content
      groupId: msg.groupId,      // Group ID for reference
      timestamp: msg.timestamp,  // Optional: Include timestamp
    }));

    res.json(formattedMessages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send('Server error');
  }
});

// Fetch group data by ID
router.get('/groups/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    // Fetch the group by ID
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Return the group name
    res.json({
      groupName: group.groupName, // Assuming 'groupName' is a field in the Group model
    });
  } catch (err) {
    console.error('Error fetching group data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
