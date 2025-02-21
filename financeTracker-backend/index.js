const express = require('express')
const app = express()
const cors = require('cors')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const logger = require('./utils/logger') 
const eventsRouter = require('./controllers/events')
// const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use('/api/frontpage', eventsRouter)
// app.use('/api/users', usersRouter)  // mikä tää sivu on? 
app.use('/api/login', loginRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

start()


