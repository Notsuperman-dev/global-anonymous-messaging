import { axiosClient } from './axiosClient.js';

document.addEventListener('DOMContentLoaded', () => {
    const userNameDisplay = document.getElementById('userName');
    const roomsContainer = document.getElementById('roomsContainer');

    const userName = localStorage.getItem('username');
    if (userName && userNameDisplay) {
        userNameDisplay.textContent = userName;
    } else {
        alert('You must be signed in to view your rooms.');
        window.location.href = 'signin.html';
        return;
    }

    async function fetchUserRooms() {
        try {
            const response = await axiosClient.get('/api/room');
            const { rooms } = response.data;
            if (rooms && rooms.length > 0) {
                roomsContainer.innerHTML = rooms.map(room => `
                    <div class="room">
                        <a href="room.html?roomName=${encodeURIComponent(room.name)}">${room.name}</a>
                        <span>Users online: ${room.userCount}</span>
                    </div>
                `).join('');
            } else {
                roomsContainer.innerHTML = '<p>You have not joined any rooms yet.</p>';
            }
        } catch (error) {
            console.error('Error fetching user rooms:', error);
        }
    }

    fetchUserRooms();
});
