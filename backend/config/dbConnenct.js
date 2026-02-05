const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
    const User = process.env.USER;
    const Password = process.env.PASSWORD;
    const DatabaseName = process.env.DATABASE_NAME;
    try {
        await mongoose.connect(`mongodb+srv://${User}:${Password}@mern.n6wzmmq.mongodb.net/${DatabaseName}?appName=MERN`)
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}
module.exports = connectDB;