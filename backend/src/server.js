import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import {connectDB} from './libs/db.js';
import cookieParser from 'cookie-parser';
import { setServers } from "node:dns/promises";
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';

setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001; 

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));

//public routes
app.use('/api/auth', authRoute); 

//private routes
app.use(protectedRoute);
app.use('/api/user', userRoute);


connectDB(); 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});