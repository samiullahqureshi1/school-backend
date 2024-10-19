import express from 'express'
import { dbConnection } from './connection/db_connection.js'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import cors from 'cors'

dotenv.config()
const app=express()
dbConnection()

app.get('/', (req, res) => {
    res.send("Hello World!");
  });


app.use(express.json())
app.use('/auth',authRouter)
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Allow credentials (cookies, authorization headers)
}));

app.listen(5000,()=>{
    console.log('server properly running on port 5000')
})