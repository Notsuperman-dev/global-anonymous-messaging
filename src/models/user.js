import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // This ensures the username is unique
    },
    // Add other fields as necessary
});

const User = mongoose.model('User', userSchema);

export default User;
