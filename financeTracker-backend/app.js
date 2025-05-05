const express = require('express')
const app = express()
// require('express-async-errors')
const cors = require('cors')
const logger = require('./utils/logger') 
const config = require('./utils/config')
const eventsRouter = require('./controllers/events')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.static('dist'))
app.use(cors())
//app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use('/api/events', eventsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.get('*', function(req, res) {
  res.sendFile('index.html', { root: __dirname + '/dist' })
})


// Reittien tarkistus
app._router.stack.forEach((middleware) => {
    if (middleware.route) { 
      console.log("Rekisteröity reitti:", middleware.route.path)
    } else if (middleware.name === "router") { // Middleware-router
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log("Rekisteröity reitti:", handler.route.path)
        }
      })
    }
  })

module.exports = app