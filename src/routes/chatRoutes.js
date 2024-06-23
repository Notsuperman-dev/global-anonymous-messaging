// src/routes/chatRoutes.js

import express from 'express';
import { getMessages, sendMessage, getChat } from '../controllers/chatController.js';

const router = express.Router();

// Route to handle basic chat
router.get('/', getChat);

// Get messages route
router.get('/:roomId', getMessages);

// Send message route
router.post('/:roomId', sendMessage);

export default router;
