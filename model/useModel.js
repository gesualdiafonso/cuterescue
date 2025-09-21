import mongoose from 'mongoose';

const mySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

const model = mongoose.model('MyCollection', mySchema);

module.exports = model;