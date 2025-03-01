require('dotenv').config()

let PORT = process.env.PORT
const SECRET = process.env.SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET 
const DATABASE_URL = process.env.DATABASE_URL

module.exports = {
  PORT,
  SECRET,
  REFRESH_SECRET,
  DATABASE_URL
}

