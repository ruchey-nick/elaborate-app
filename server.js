const mongoose = require('mongoose')
const dotenv = require('dotenv').config({ path: './config.env' })

const app = require('./app')

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
    console.log(err)
    process.exit(1)
}); 

// connect 
// hide the connection string!
const connectString = process.env.CONNECTION_STRING
mongoose.connect(connectString, 
    {
        dbName: 'elaborate-app'
    }).then(() => console.log('Database connection successful!'))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})