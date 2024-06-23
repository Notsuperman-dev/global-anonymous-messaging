document.addEventListener('DOMContentLoaded', () => {
    const getUsername = () => {
        return localStorage.getItem('username');
    };

    const username = getUsername();

    if (!username) {
        window.location.href = 'Username.html';
        return;
    }

    // Display the username
    const userNameSpan = document.getElementById('userName');
    if (userNameSpan) {
        userNameSpan.textContent = username;
    }

    // Event listeners for navigation buttons
    document.getElementById('createRoomButton').addEventListener('click', () => {
        window.location.href = 'createroom.html';
    });

    document.getElementById('joinRoomButton').addEventListener('click', () => {
        window.location.href = 'joinroom.html';
    });

    document.getElementById('worldChatButton').addEventListener('click', () => {
        window.location.href = 'worldchat.html';
    });

    document.getElementById('trendingRoomsButton').addEventListener('click', () => {
        window.location.href = 'trendingrooms.html';
    });

    // Initialize Socket.IO client
    const socket = io({
        auth: {
            username: username  // Send username with socket connection
        }
    });

    // Listen for messages from the server
    if (socket) {
        socket.on('message', (message) => {
            console.log('Message from server:', message);
        });

        // Add more event listeners if needed
    }
});
