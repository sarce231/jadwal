import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Konversi __dirname di ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Setup folder uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB is Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Model Chat
import Chat from './models/Chat.js';

// Routes
import chatRoutes from './routes/chatRoutes.js';
import scheduleRoutes from './routes/schedule.js';
// import notificationRoutes from './routes/notificationRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

app.use('/api/schedules', scheduleRoutes);
app.use('/api/chats', chatRoutes);
// app.use('/api/notifications', notificationRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// === Socket.IO Real-Time ===
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  Chat.findOne({ name: 'default' })
    .then(chat => {
      console.log("Sending initial messages:", chat?.messages?.length || 0);
      socket.emit('initialMessages', chat?.messages || []);
    })
    .catch(err => {
      console.error("Error fetching initial messages:", err);
      socket.emit('initialMessages', []);
    });

  socket.on('sendMessage', (msg) => {
    const message = {
      sender: msg.sender,
      userName: msg.userName,
      text: msg.text,
      timestamp: new Date().toISOString()
    };

    Chat.findOneAndUpdate(
      { name: 'default' },
      { $push: { messages: message } },
      { new: true, upsert: true }
    )
      .then(chat => {
        console.log('Message saved, emitting to clients:', message);
        io.emit('newMessage', message);
      })
      .catch(err => {
        console.error('Error saving message:', err);
        socket.emit('messageError', 'Failed to send message');
      });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
