const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const connectDB = require("./config/db")
const errorHandlerMiddleware = require("./utils/error-handler")
const notFoundMiddleware = require("./utils/not-found")


const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);



// //error handler
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


const port = process.env.PORT || 5000


const start = async () => {
    try{
        //connect DB
        await connectDB()
        console.log("Connected to DB")
        app.listen(port, "0.0.0.0", console.log(`Server is listening to port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start();