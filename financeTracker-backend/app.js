const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger') 
const config = require('./utils/config')
const eventsRouter = require('./controllers/events')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use('/api/events', eventsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.get('*', function(req, res) {
  res.sendFile('index.html', { root: __dirname + '/dist' })
})


module.exports = app