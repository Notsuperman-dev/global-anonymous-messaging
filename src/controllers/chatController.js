// src/controllers/chatController.js

export const getChat = (req, res) => {
    res.send('Chat route');
  };
  
  export const getMessages = async (req, res) => {
    const { roomId } = req.params;
    // Add your logic to get messages from the database for the given roomId
    res.send(`Messages for room ${roomId}`);
  };
  
  export const sendMessage = async (req, res) => {
    const { roomId } = req.params;
    const { message } = req.body;
    // Add your logic to save the message to the database for the given roomId
    res.send(`Message sent to room ${roomId}: ${message}`);
  };
  