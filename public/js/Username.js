document.addEventListener('DOMContentLoaded', () => {
    const createUsernameButton = document.getElementById('createUsernameButton');

    createUsernameButton.addEventListener('click', async () => {
        const usernameInput = document.getElementById('usernameInput');
        const username = usernameInput.value.trim();

        if (username) {
            try {
                // Check if username is unique
                const response = await fetch('/api/check-username', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });

                const data = await response.json();

                if (data.isUnique) {
                    localStorage.setItem('username', username);
                    window.location.href = 'mainmenu.html';
                } else {
                    alert('Username is already taken. Please choose another one.');
                }
            } catch (error) {
                console.error('Error checking username:', error);
            }
        } else {
            alert('Please enter a username.');
        }
    });
});
