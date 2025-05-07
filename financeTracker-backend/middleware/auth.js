const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers.authorization
  // Tarkistetaan, että header on olemassa ja alkaa Bearer -merkkijonolla
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  // Poimitaan itse token, joka tulee sanan Bearer jälkeen
  const token = authHeader.split(' ')[1]
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return response.status(403).json({ error: 'Invalid or expired token' })
    }
    request.user = decoded
    next()
  })
}

module.exports = authenticateToken

