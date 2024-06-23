document.addEventListener('DOMContentLoaded', () => {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const changeUsernameForm = document.getElementById('changeUsernameForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const messageDiv = document.getElementById('message');

    const displayMessage = (message, type = 'error') => {
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        messageDiv.className = `message ${type}`;
    };

    const clearMessage = () => {
        messageDiv.textContent = '';
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
    };

    const username = localStorage.getItem('username');
    if (username) {
        usernameDisplay.textContent = `- ${username}`;
    }

    if (changeUsernameForm) {
        changeUsernameForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessage();

            const formData = new FormData(changeUsernameForm);
            const newUsername = formData.get('new-username');

            if (!newUsername) {
                displayMessage('Please enter a new username.');
                return;
            }

            try {
                const response = await axios.post('/api/auth/change-username', { currentUsername: username, newUsername }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    displayMessage('Username changed successfully!', 'success');
                    localStorage.setItem('username', newUsername);
                    usernameDisplay.textContent = `- ${newUsername}`;
                } else {
                    displayMessage(response.data.message || 'Failed to change username.');
                }
            } catch (error) {
                console.error('Error changing username:', error);
                displayMessage(error.response?.data?.message || 'An error occurred. Please try again.');
            }
        });
    }

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessage();

            const formData = new FormData(changePasswordForm);
            const currentPassword = formData.get('current-password');
            const newPassword = formData.get('new-password');

            if (!currentPassword || !newPassword) {
                displayMessage('Please enter both current and new passwords.');
                return;
            }

            try {
                const response = await axios.post('/api/auth/change-password', { username, currentPassword, newPassword }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    displayMessage('Password changed successfully!', 'success');
                } else {
                    displayMessage(response.data.message || 'Failed to change password.');
                }
            } catch (error) {
                console.error('Error changing password:', error);
                displayMessage(error.response?.data?.message || 'An error occurred. Please try again.');
            }
        });
    }
});
