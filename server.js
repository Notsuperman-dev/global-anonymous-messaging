import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server as SocketIOServer } from 'socket.io';

import roomRoutes from './src/routes/roomRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

connectDB();

// CORS configuration to allow any origin
const corsOptions = {
    origin: '*', // Allow any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/room', roomRoutes);
app.use('/api', authRoutes);

app.use(errorHandler);

app.get('/joinroom', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'joinroom.html'));
});

app.get('/createroom', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createroom.html'));
});

app.get('/rooms.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rooms.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);

const io = new SocketIOServer(server, {
    cors: {
        origin: '*', // Allow any origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

const roomUserCount = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ roomName }) => {
        socket.join(roomName);
        console.log(`Client joined room: ${roomName}`);
        socket.roomName = roomName;

        if (!roomUserCount[roomName]) {
            roomUserCount[roomName] = 0;
        }
        roomUserCount[roomName] += 1;

        console.log(`Updated user count for room ${roomName}: ${roomUserCount[roomName]}`);
        io.to(roomName).emit('userCountUpdate', roomUserCount[roomName]);
        io.emit('trendingUserCountUpdate', { roomName, userCount: roomUserCount[roomName] });
    });

    socket.on('sendMessage', ({ roomName, message }) => {
        console.log(`Message received in room ${roomName}: ${message.text}`);
        io.to(roomName).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        const roomName = socket.roomName;
        if (roomName && roomUserCount[roomName]) {
            roomUserCount[roomName] -= 1;
            console.log(`Updated user count for room ${roomName}: ${roomUserCount[roomName]}`);
            io.to(roomName).emit('userCountUpdate', roomUserCount[roomName]);
            io.emit('trendingUserCountUpdate', { roomName, userCount: roomUserCount[roomName] });
        }
    });
});

const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
