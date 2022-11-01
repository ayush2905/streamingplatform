import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js'
import videoRoutes from './routes/videos.js'
import commentRoutes from './routes/comments.js'
import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO).then(() => {        //env file stores the id and password to hide them
        console.log("Connected to the DB");
    }).catch((err) => {
        throw err;
    });
};

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);    //syntax : app.use(path, callback)
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

//error handling
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status: status,
        message: message
    })
})

app.listen(8800, ()=> {
    connect()
    console.log("Connected to server");
})