const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://shirishthore07:Shirish1123@cluster0.zhjoag1.mongodb.net/inotebook?retryWrites=true&w=majority';
const connectToMongo = async () => {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
};

module.exports = connectToMongo;