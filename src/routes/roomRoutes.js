import express from 'express';
import { createRoom, joinRoom, leaveRoom, sendMessage, getMessages, getRooms, getTrendingRooms, getRoomName, getUserRooms } from '../controllers/roomController.js';

const router = express.Router();

router.post('/', createRoom);
router.post('/room/join', joinRoom);
router.post('/room/leave', leaveRoom);
router.post('/room/message', sendMessage);
router.get('/room/messages/:roomId', getMessages);
router.get('/rooms', getRooms);
router.get('/rooms/trending', getTrendingRooms);
router.get('/room/:roomName', getRoomName);
router.get('/user/rooms', getUserRooms);

export default router;
