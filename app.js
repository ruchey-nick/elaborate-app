const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')

// routers

// init
const app = express()
// protection
app.use(helmet())

// development middleware for analyzing requests
app.use(morgan('dev'))

// limit requests from the same IP
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, try again in an hour!'
})

app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

// Data sanitization against noSQL query injection
app.use(mongoSanitize())

// Query String Parameter Sanitization 
app.use(hpp({ whitelist: [] }))

// serving static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

userRouter = require('./routes/userRouter')
// Routes
app.use('/api/v1/users', userRouter)

module.exports = app