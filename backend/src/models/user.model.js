import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    password: {
        type: String,
        required: true,
        minLength: 6,
    },

    level: {
        type: Number,
        default: 1,
    },

    xp: {
        type:Number,
        default: 0,
    },

    courses: {
        type: Array,
        default: []
    },

    streak: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
