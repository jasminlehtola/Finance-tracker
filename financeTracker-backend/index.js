const app = require('./app') // varsinainen Express-sovellus
const logger = require('./utils/logger')
const config = require('./utils/config')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

start()




