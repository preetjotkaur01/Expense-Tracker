const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/ExpenseTracker";

const connectToMongo = ()=>{
    mongoose.connect(url);
};

module.exports = connectToMongo;