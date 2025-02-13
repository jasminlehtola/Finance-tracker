const app = require('./app') 
const config = require('./utils/config')
const logger = require('./utils/logger') 

require('dotenv').config()

const { Sequelize, QueryTypes } = require('sequelize')


app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })  


const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Database connected and synchronized.')
    // sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()