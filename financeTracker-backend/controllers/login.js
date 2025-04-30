const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const loginRouter = require('express').Router()
const { User } = require('../models/user')
const { SECRET, REFRESH_SECRET  } = require('../utils/config')

const authenticateToken = require('../middleware/auth')

/* 
// Palauta tapahtumat käyttäjälle
loginRouter.get('/', authenticateToken, async (request, response) => {
  const user = request.user  // Käyttäjä, joka saatiin tokenista
})
  */


loginRouter.post('/', async (request, response) => {
  const {username, password} = request.body

  const user = await User.findOne({where: {username}})

  if (!user) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  console.log("User found:", user) // debugausta varten

  if (!user.password) {
    console.log("Password not found in database!")
    return response.status(500).json({ error: "User password not found in database!" })
  }


  const passwordCorrect = await bcryptjs.compare(password, user.password)
  if (!passwordCorrect) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  // Luodaan pääsytunnus (access token)
  const accessToken = jwt.sign(userForToken, SECRET, { expiresIn: '10s' })

  // Luodaan uudelleenlataustunnus (refresh token)
  const refreshToken = jwt.sign(userForToken, SECRET, { expiresIn: '1d' })

  console.log("Login successful! Returning token.")

  response.status(200).json({ 
    accessToken,
    refreshToken, 
    username: user.username, 
    id: user.id })
})


loginRouter.post('/refresh', async (request, response) => {
  const { refreshToken } = request.body

  if (!refreshToken) {
    return response.status(401).json({ error: 'Refresh token is required' })
  }

  try {
  // Tarkistetaan, onko refresh token validi ja ei ole vanhentunut
  const decoded = jwt.verify(refreshToken, SECRET)
    
  // Luodaan uusi access token
  const newAccessToken = jwt.sign({ username: decoded.username, id: decoded.id }, SECRET, { expiresIn: '1h' })

  return response.json({ accessToken: newAccessToken })
  } catch (error) {
    console.error("Refresh token error:", error)
    return response.sendStatus(403) 
  }
  })


module.exports = loginRouter