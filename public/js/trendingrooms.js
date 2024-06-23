import { axiosClient } from './axiosClient.js';

document.addEventListener('DOMContentLoaded', () => {
    const roomsList = document.getElementById('roomsList');

    function createRoomElement(room) {
        const roomLink = document.createElement('a');
        roomLink.href = `rooms.html?roomName=${encodeURIComponent(room.name)}`;
        roomLink.className = 'room-link';
        roomLink.dataset.roomId = room._id;

        const roomElement = document.createElement('div');
        roomElement.className = 'room';

        const roomName = document.createElement('h2');
        roomName.textContent = room.name;

        const roomUserCount = document.createElement('p');
        roomUserCount.textContent = `User Count: ${room.userCount}`;
        roomUserCount.className = 'user-count';

        roomElement.appendChild(roomName);
        roomElement.appendChild(roomUserCount);
        roomLink.appendChild(roomElement);
        return roomLink;
    }

    async function fetchTrendingRooms() {
        try {
            const response = await axiosClient.get('/room/trending');
            console.log('Full response:', response);
            console.log('Response data:', response.data);

            const { rooms } = response.data;

            if (!Array.isArray(rooms)) {
                throw new Error('Invalid data format received');
            }

            roomsList.innerHTML = '';

            rooms.forEach(room => {
                const roomLink = createRoomElement(room);
                roomsList.appendChild(roomLink);
            });

            sortRoomsList();
        } catch (error) {
            console.error('Error fetching rooms:', error);
            roomsList.innerHTML = '<p>An error occurred while fetching the trending rooms. Please try again later.</p>';
        }
    }

    fetchTrendingRooms();

    const socket = io();

    socket.on('trendingUserCountUpdate', ({ roomId, userCount }) => {
        console.log(`Received update for room ${roomId}: User Count ${userCount}`);
        let roomLink = document.querySelector(`a[data-room-id="${roomId}"]`);
        if (roomLink) {
            const userCountElement = roomLink.querySelector('.user-count');
            userCountElement.textContent = `User Count: ${userCount}`;
        } else {
            axiosClient.get(`/room/details/${roomId}`).then(response => {
                const newRoom = response.data;
                if (newRoom) {
                    roomLink = createRoomElement(newRoom);
                    roomsList.appendChild(roomLink);
                    sortRoomsList();
                }
            }).catch(error => {
                console.error(`Error fetching new room details: ${error}`);
            });
        }
        sortRoomsList();
    });

    function sortRoomsList() {
        const roomsArray = Array.from(roomsList.children);
        roomsArray.sort((a, b) => {
            const countA = parseInt(a.querySelector('.user-count').textContent.split(': ')[1], 10);
            const countB = parseInt(b.querySelector('.user-count').textContent.split(': ')[1], 10);
            return countB - countA;
        });
        roomsList.innerHTML = '';
        roomsArray.forEach(room => roomsList.appendChild(room));
    }
});
