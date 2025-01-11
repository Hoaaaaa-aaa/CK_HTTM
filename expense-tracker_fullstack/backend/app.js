
require('dotenv').config()
const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

// Import routes
const chatRoutes = require('./routes/chat')
const transactionRoutes = require('./routes/transactions')



const PORT = process.env.PORT|| 5000


//middlewares
app.use(express.json())
app.use(cors())

// Mount routes with prefix
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/transactions', transactionRoutes)

//routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

const startServer = async () => {
    try {
        await db() // Connect to MongoDB first
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
            console.log(`Test URL: http://localhost:${PORT}/test`)
            console.log(`Chat API URL: http://localhost:${PORT}/api/v1/chat/test`)
            console.log(`Transactions API URL: http://localhost:${PORT}/api/v1/transactions/get-incomes`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
    }
}

startServer()

module.exports = app
