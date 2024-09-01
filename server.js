const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const chatbot = require('./routes/chatbot');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://8.215.50.23"],
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://8.215.50.23"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "x-socket-id"] // Tambahkan x-socket-id di sini
}));

// Routes
app.use('/api', chatbot(io)); // Pass io to router

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register user
  socket.on('register', () => {
    io.emit('user-connected', socket.id); // Optionally notify other users
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});