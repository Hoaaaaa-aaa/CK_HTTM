const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT|| 5000

//middlewares
app.use(express.json())
app.use(cors())

//routes
const authRoutes = require('./routes/auth');

// Existing routes
readdirSync('./routes').map((route) => {
    if (route !== 'auth.js') { // Skip auth.js as we're handling it separately
        app.use('/api/v1', require('./routes/' + route))
    }
})

// Auth routes
app.use('/api/v1', authRoutes);

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()