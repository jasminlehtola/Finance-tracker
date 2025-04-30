const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers.authorization
  // Tarkistetaan, että header on olemassa ja alkaa Bearer -merkkijonolla
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //window.location.href = '/login' // Ohjaa kirjautumissivulle
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const token = authHeader.split(' ')[1]
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      //window.location.href = '/login' // Ohjaa kirjautumissivulle
      return response.status(403).json({ error: 'Invalid or expired token' })
    }
    request.user = decoded
    next()
  })
}

module.exports = authenticateToken

