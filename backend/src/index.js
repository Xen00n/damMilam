import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';  
import { dirname } from 'path'; 
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${server.address().port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying another port...`);
        // Start the server again with dynamic port (0 will allow dynamic allocation)
        const dynamicServer = app.listen(0, () => {
          console.log(`Server is running on a dynamic port: ${dynamicServer.address().port}`);
          const dynamicPort = dynamicServer.address().port;
        });
      } else {
        console.error(err); // For any other error
      }
    });
  })
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', authRoutes);
