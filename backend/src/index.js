import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use. Trying another port...`);
          app.listen(0, () => console.log(`Server is running on a dynamic port`));
        } else {
          console.error(err);//for error
        }
      });
  })
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/db-status', async (req, res) => {
  const state = mongoose.connection.readyState;
  // Mongoose connection states: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const statusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.json({ status: statusMap[state] || 'Unknown' });
});
