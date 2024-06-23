document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://YOUR_SERVER_IP_OR_DOMAIN:3001'); // Replace with your server's IP or domain
    console.log('Connecting to Socket.IO...');

    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messages = document.getElementById('messages');
    const username = localStorage.getItem('username');

    if (!username) {
        alert('Username not found. Please sign in again.');
        window.location.href = 'signin.html';
        return;
    }

    const roomName = 'global';
    socket.emit('joinRoom', { roomName });

    socket.on('connect', () => {
        console.log('Successfully connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
    });

    socket.on('message', (message) => {
        console.log('Received message:', message);
        if (message && message.username && message.text) {
            const div = document.createElement('div');
            div.textContent = `${message.username}: ${message.text}`;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        } else {
            console.error('Malformed message received:', message);
        }
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (messageInput.value.trim()) {
            console.log('Sending message:', messageInput.value);
            socket.emit('sendMessage', { roomName, username, text: messageInput.value.trim() });
            messageInput.value = '';
        }
    });
});
