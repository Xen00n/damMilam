import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/productRoutes.js';
import bargainingGroupRoutes from './routes/bargainingGroup.js';
import Message from './models/Message.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoute from './routes/paymentRoute.js';
import Product from './models/Product.js';
import Group from './models/Group.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Environment variables
const PORT = process.env.PORT || 6969;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying another port...`);
        const dynamicServer = app.listen(0, () => {
          console.log(`Server is running on a dynamic port: ${dynamicServer.address().port}`);
          setupSocketIO(dynamicServer);
        });
      } else {
        console.error('Server error:', err);
      }
    });

    setupSocketIO(server);
  })
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Socket.IO setup
function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Replace with your frontend URL
      methods: ['GET', 'POST'],
    },
  });

  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    // User joins a group
    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`User joined group: ${groupId}`);
    });
  
    // Send a regular message
    socket.on('sendMessage', async ({ groupId, message, senderName }, callback) => {
      try {
        const newMessage = new Message({
          groupId,
          senderName,
          text: message,
        });
  
        await newMessage.save();
  
        // Notify other group members
        io.to(groupId).emit('newMessage', newMessage);
        callback(null);
      } catch (err) {
        console.error('Error sending message:', err);
        callback('Error sending message');
      }
    });
  
    // Propose an offer
    socket.on('sendOffer', async ({ groupId, senderName, priceOffer }, callback) => {
      try {
        const newMessage = new Message({
          groupId,
          senderName,
          priceOffer,
          negotiationStatus: 'pending',
        });
  
        await newMessage.save();
  
        // Notify group members of the new offer
        io.to(groupId).emit('newMessage', newMessage);
        callback(null);
      } catch (err) {
        console.error('Error sending offer:', err);
        callback('Error sending offer');
      }
    });
  
    // Respond to an offer (Accept, Reject, or Counter)
    // Respond to an offer (Accept, Reject, or Counter)
socket.on('respondToOffer', async ({ groupId, messageId, status }, callback) => {
  try {
    const message = await Message.findById(messageId);
    const group = await Group.findById(groupId);
    const product = await Product.findById(group.productId);
    if (!message) {
      callback('Message not found');
      return;
    }
    if (!product) {
      callback('Product not found');
      return;
    }
    // Update negotiation status
    message.negotiationStatus = status;
    if(status == 'accepted' ){
      product.price = message.priceOffer;
    }

    await message.save();
    await product.save();

    // Emit the updated message to the group
    io.to(groupId).emit('updateOfferStatus', message);
    callback(null);
  } catch (err) {
    console.error('Error responding to offer:', err);
    callback('Error responding to offer');
  }
});

    
  
    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  
  
}



// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', paymentRoute);

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api/bargaining-group', bargainingGroupRoutes);
app.use('/api', messageRoutes);
