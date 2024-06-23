document.addEventListener('DOMContentLoaded', () => {
    const joinFunButton = document.getElementById('joinFunButton');

    // Function to get username from localStorage
    const getUsername = () => {
        return localStorage.getItem('username');
    };

    const username = getUsername();
    if (username) {
        window.location.href = 'mainmenu.html';
        return;
    }

    // Redirect to username creation page if no username exists
    if (joinFunButton) {
        joinFunButton.addEventListener('click', () => {
            window.location.href = 'Username.html';
        });
    }

    // Initialize Socket.IO client
    const initializeSocket = () => {
        if (username) {
            return io({
                auth: {
                    username: username  // Send username with socket connection
                }
            });
        }
    };

    const socket = initializeSocket();

    // Listen for messages from the server
    if (socket) {
        socket.on('message', (message) => {
            console.log('Message from server:', message);
        });

        // Handle send message button click
        const sendMessageButton = document.getElementById('sendMessageButton');
        if (sendMessageButton) {
            sendMessageButton.addEventListener('click', () => {
                const messageInput = document.getElementById('messageInput');
                if (messageInput && messageInput.value.trim() !== '') {
                    const message = messageInput.value.trim();
                    socket.emit('sendMessage', message);
                    messageInput.value = ''; // Clear input field
                }
            });
        }
    }
});
