document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('createForm');

    if (createForm) {
        createForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const roomName = document.getElementById('roomNameInput').value.trim();

            if (!roomName) {
                alert('Room name cannot be empty');
                return;
            }

            const data = { name: roomName };

            try {
                const response = await fetch('http://localhost:3000/api/room', {  // Adjust the port to 3000 if necessary
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Room created successfully!');
                    window.location.href = `rooms.html?roomName=${encodeURIComponent(roomName)}`;
                } else {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        const responseData = await response.json();
                        alert(responseData.message || 'Failed to create room');
                    } else {
                        alert('Failed to create room. Server returned an unexpected response.');
                    }
                }
            } catch (error) {
                console.error('Error creating room:', error);
                alert('An error occurred while creating the room. Please try again.');
            }
        });
    }
});
