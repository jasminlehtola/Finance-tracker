const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

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


  /*const token = req.headers.authorization?.split(' ')[1]  // Token saadaan Authorization headerista

  if (!token) return res.status(401).json({ error: 'Token missing' })

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is not valid' })
    req.user = user  // Lisää käyttäjä tiedot requestiin
    next()  // Jatka seuraavaan reittiin
  })
}
  */
