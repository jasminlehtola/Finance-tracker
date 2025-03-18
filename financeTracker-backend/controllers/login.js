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
  const accessToken = jwt.sign(userForToken, SECRET, { expiresIn: '1h' })

  // Luodaan uudelleenlataustunnus (refresh token)
  const refreshToken = jwt.sign(userForToken, SECRET, { expiresIn: '3d' })

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

  // Varmistetaan, että refresh token on validi
  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return response.status(403).json({ error: 'Invalid refresh token' })
    }

    // Uusi pääsytunnus
    const userForToken = { username: decoded.username, id: decoded.id }
    const newAccessToken = jwt.sign(userForToken, SECRET, { expiresIn: '1h' })
    console.log("Refresh-token tehty")

    response.status(200).json({ accessToken: newAccessToken });
  });
});

module.exports = loginRouter