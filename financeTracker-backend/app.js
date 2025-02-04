const express = require('express')
const app = express()
const cors = require('cors')

const eventsRouter = require('./controllers/events')
const logger = require('./utils/logger')



app.use(cors())
app.use(express.json())
app.use('/api/frontpage', eventsRouter)



module.exports = app
