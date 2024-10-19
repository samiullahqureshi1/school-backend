import express from 'express'
import { dbConnection } from './connection/db_connection.js'
import dotenv from 'dotenv'

dotenv.config()
const app=express()
dbConnection()

app.get('/', (req, res) => {
    res.send("Hello World!");
  });
app.use(express.json())
app.listen(5000,()=>{
    console.log('server properly running on port 5000')
})