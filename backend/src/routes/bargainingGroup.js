import express from 'express';
import Group from '../models/Group.js';
import { authenticate } from '../routes/auth.js'; // Import the authenticate middleware

const router = express.Router();

// Route to fetch all groups, with access information for the authenticated user
router.get('/', authenticate, async (req, res) => {
    const userId = req.user._id; // Get the userId from the authenticated user
  
    try {
      // Fetch groups and populate relevant fields
      const groups = await Group.find()
        .populate('productId')     // Populate product details
        .populate('userId')        // Populate the group owner (user)
        .populate('participants')  // Populate participants
        .populate('access');       // Populate access list
  
      // Add the access check to the groups and include the userId
      const groupsWithUserId = groups.map(group => {
        const hasAccess = group.access.some(user => user._id.toString() === userId.toString());
        const isOwner = group.userId._id.toString() === userId.toString(); // Check if the logged-in user is the owner

        return {
          ...group.toObject(),   // Convert Mongoose document to plain JavaScript object
          userId: group.userId._id.toString(), // Use the owner ID from populated data
          hasAccess,              // Check if the user has access
          isOwner,                // Check if the logged-in user is the owner
        };
      });
  
      res.json(groupsWithUserId); // Send the groups with userId and access information
    } catch (err) {
      console.error('Error fetching groups:', err);
      res.status(500).json({ message: 'Error fetching groups' });
    }
});


// **New Route** to create a new group
// **New Route** to create a new group
router.post('/create', authenticate, async (req, res) => {
    const userId = req.user._id; // The user creating the group (authenticated user)
    const { productName, productId, price } = req.body; // Extract productName, productId, and price from the body
  
    // Check if all required fields are provided
    if (!productName || !productId || !price) {
      return res.status(400).json({ message: 'Product name, product ID, and price are required' });
    }
  
    try {
      // Create a new group
      const newGroup = new Group({
        productId,
        userId, // Set the creator of the group as the user
        access: [userId], // Initially, the creator has access
        participants: [], // No participants yet
        requests: [], // No requests yet
        name: productName, // Set the group name as the product name
        price, // Add the price of the product
        groupName: productName, // You can either use productName or pass something else for groupName
      });
  
      // Save the group to the database
      const group = await newGroup.save();
  
      // Return success response
      res.status(201).json({
        success: true,
        message: 'Group created successfully',
        group, // Send back the created group
      });
    } catch (err) {
      console.error('Error creating group', err);
      res.status(500).json({ message: 'Error creating group' });
    }
});
// Route to send a join request to a group (requires authentication)
router.post('/request/:groupId', authenticate, async (req, res) => {
    const userId = req.user._id; // Get the authenticated user's ID
    const { groupId } = req.params;
    const { role, name } = req.body; // Extract role (buyer/seller) and name from the body
    
    // Check if the role is valid
    if (!role || !['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be either buyer or seller.' });
    }
  
    // Check if name is provided
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Name is required and should be a string.' });
    }
  
    try {
      const group = await Group.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      // Check if the user is already in the access list or participants list
      if (group.access.includes(userId) || group.participants.includes(userId)) {
        return res.status(400).json({ message: 'You already have access to this group' });
      }
  
      // Check if the user has already sent a request
      const existingRequest = group.requests.find(request => request.userId.toString() === userId.toString());
      if (existingRequest) {
        return res.status(400).json({ message: 'You have already sent a request to join this group' });
      }
  
      // Add the user to the requests list with their role and name
      group.requests.push({
        userId,
        username: req.user.username, // Add the username from the user session
        name, // Store the user's name
        role, // Store the user's role (buyer/seller)
        status: 'pending' 
      });
  
      await group.save();
      
      res.status(200).json({ message: 'Join request sent successfully' });
    } catch (err) {
      console.error('Error sending join request', err);
      res.status(500).json({ message: 'Error sending join request' });
    }
  });
  
  // Owner accepts or rejects a join request (requires authentication)
// Owner accepts or rejects a join request (requires authentication)
router.post('/accept-reject/:groupId/:requestId', authenticate, async (req, res) => {
  const userId = req.user._id; // The authenticated user (group owner)
  const { groupId, requestId } = req.params; // The groupId and requestId from the URL

  try {
    // Find the group by groupId
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Ensure the user is the owner of the group
    if (group.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to manage this group' });
    }

    // Find the specific request by requestId
    const requestIndex = group.requests.findIndex(request => request._id.toString() === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update request status based on the action (either accept or reject)
    const request = group.requests[requestIndex]; // Get the request from the array

    if (req.body.status === 'accepted') {
      // Add the user to the access list if the request is accepted
      group.access.push(request.userId);
    }

    // Set the request's status to either "accepted" or "rejected"
    request.status = req.body.status;

    // Remove the request from the requests array after processing
    group.requests.splice(requestIndex, 1); // Remove the request at the given index

    // Save the updated group
    await group.save();

    // Return a success response
    res.status(200).json({ message: `Request ${req.body.status} successfully` });
  } catch (err) {
    console.error('Error processing request', err);
    res.status(500).json({ message: 'Error processing request' });
  }
});


  

export default router;
