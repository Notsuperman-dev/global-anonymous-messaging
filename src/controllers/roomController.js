import Room from '../models/Room.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

let roomUserCounts = {}; // Keep track of user counts for rooms

export const createRoom = async (req, res) => {
    try {
        const { name } = req.body;
        console.log('Received room creation request:', name);

        // Validate room name length
        if (!name || name.length < 5 || name.length > 30) {
            console.log('Room name validation failed');
            return res.status(400).json({ message: 'Room name must be between 5 and 30 characters.' });
        }

        // Check if the room name already exists
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            console.log('Room name already exists');
            return res.status(409).json({ message: 'Room name already exists. Please choose a different name.' });
        }

        // Create and save the new room
        const newRoom = new Room({ name });
        await newRoom.save();
        console.log('New room created:', newRoom);

        res.status(201).json({ room: newRoom });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const joinRoom = async (req, res) => {
    try {
        const { name } = req.body;
        const room = await Room.findOne({ name });

        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        if (!roomUserCounts[name]) {
            roomUserCounts[name] = 0;
        }

        // Increment user count when a user joins the room
        room.userCount += 1;
        roomUserCounts[name] += 1;
        await room.save();

        // Add the room to the user's joined rooms
        const user = await User.findById(req.user._id);
        if (!user.roomsJoined.includes(room._id)) {
            user.roomsJoined.push(room._id);
            await user.save();
        }

        res.status(200).json({ room });
    } catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const leaveRoom = async (req, res) => {
    try {
        const { name } = req.body;
        const room = await Room.findOne({ name });

        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        if (!roomUserCounts[name]) {
            roomUserCounts[name] = 0;
        }

        // Decrement user count when a user leaves the room
        room.userCount = Math.max(0, room.userCount - 1);
        roomUserCounts[name] = Math.max(0, roomUserCounts[name] - 1);
        await room.save();

        // Remove the room from the user's joined rooms
        const user = await User.findById(req.user._id);
        user.roomsJoined = user.roomsJoined.filter(roomId => roomId.toString() !== room._id.toString());
        await user.save();

        res.status(200).json({ room });
    } catch (error) {
        console.error('Error leaving room:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { roomId, message } = req.body;
        const newMessage = new Message({ roomId, message, user: req.user._id });
        await newMessage.save();
        res.status(201).json({ message: newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'An error occurred while sending the message.' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'An error occurred while retrieving messages.' });
    }
};

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().select('name userCount');
        res.status(200).json({ rooms });
    } catch (error) {
        console.error('Error retrieving rooms:', error);
        res.status(500).json({ message: 'An error occurred while retrieving rooms.' });
    }
};

export const getTrendingRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ userCount: -1 }).limit(10);
        res.json({ rooms });
    } catch (error) {
        console.error('Error fetching trending rooms:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getRoomName = async (req, res) => {
    const { roomName } = req.params;
    try {
        const room = await Room.findOne({ name: roomName });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ name: room.name, userCount: room.userCount });
    } catch (error) {
        console.error('Error fetching room name:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserRooms = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('roomsJoined', 'name userCount')
            .populate('roomsCreated', 'name userCount');

        const rooms = {
            joined: user.roomsJoined,
            created: user.roomsCreated,
        };

        res.status(200).json({ rooms });
    } catch (error) {
        console.error('Error retrieving user rooms:', error);
        res.status(500).json({ message: 'An error occurred while retrieving user rooms.' });
    }
};
