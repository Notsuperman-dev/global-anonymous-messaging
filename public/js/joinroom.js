
    // Function to handle room joining
    if (joinForm) {
        joinForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const roomName = document.getElementById('roomNameInput').value.trim();

            if (!roomName) {
                alert('Room name cannot be empty');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/api/room?name=${encodeURIComponent(roomName)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.status === 200) {
                    alert('Room joined successfully!');
                    window.location.href = `rooms.html?roomName=${encodeURIComponent(roomName)}`;
                } else {
                    const responseData = await response.json();
                    alert(responseData.message || 'Failed to join room');
                }
            } catch (error) {
                console.error('Error joining room:', error);
                alert('An error occurred while joining the room. Please try again.');
            }
        });
    }