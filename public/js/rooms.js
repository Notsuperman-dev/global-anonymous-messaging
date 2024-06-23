document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');

    // Function to handle sending messages
    if (messageForm) {
        messageForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();

            if (!message) {
                alert('Message cannot be empty');
                return;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const roomName = urlParams.get('roomName');

            if (!roomName) {
                alert('Room name is missing in the URL');
                return;
            }

            try {
                const response = await axios.post('/api/room/message', { roomName, message }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 201) {
                    messageInput.value = '';
                    // You might want to append the message to the messagesContainer here
                } else {
                    alert(response.data.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('An error occurred while sending the message. Please try again.');
            }
        });
    }

    // Function to handle displaying room details
    (async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const roomName = urlParams.get('roomName');

        if (roomName) {
            document.getElementById('roomName').textContent = roomName;

            try {
                const response = await fetch(`/api/room/${encodeURIComponent(roomName)}`);
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const data = await response.json();

                    if (response.status === 200) {
                        document.getElementById('userCount').textContent = `Users online: ${data.userCount}`;
                    } else {
                        alert(data.message || 'Failed to retrieve room details');
                    }
                } else {
                    const text = await response.text();
                    console.error('Unexpected response format:', text);
                    alert('An unexpected error occurred. Please check the console for details.');
                }
            } catch (error) {
                console.error('Error retrieving room details:', error);
                alert('An error occurred while retrieving room details. Please try again.');
            }
        } else {
            alert('Room name is missing in the URL');
        }
    })();
});
