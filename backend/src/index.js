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
  
    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`User joined group: ${groupId}`);
    });
  
    socket.on('sendMessage', async ({ groupId, message, senderName }, callback) => {
      try {
        const newMessage = new Message({
          groupId,
          senderName, // Save the actual sender's name
          text: message,
        });
  
        await newMessage.save();
  
        // Emit the message to others in the group
        io.to(groupId).emit('newMessage', newMessage);
        callback(null); // Acknowledge success
      } catch (err) {
        console.error('Error saving message:', err);
        callback('Error sending message');
      }
    });
  
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  
}

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api/bargaining-group', bargainingGroupRoutes);
app.use('/api', messageRoutes);
