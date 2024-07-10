require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')


connectToMongo();
const app = express()
const port = 5000

app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use('/api/auth', require('./routes/auth'))
app.use('/api/student', require('./routes/student'))

app.listen(port, ()=>{
    console.log(`Login backend listening at http://localhost:${port}`)
})

