import express from 'express';
import { dbConnection } from './connection/db_connection.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import cors from 'cors';

dotenv.config();
const app = express();
dbConnection();

// CORS configuration should be placed before route definitions
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Allow credentials (cookies, authorization headers)
}));

// Middleware for parsing JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello World!");
});

// Define your routes after the CORS middleware
app.use('/auth', authRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
