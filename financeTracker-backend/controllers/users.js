const userRouter = require('express').Router()
const logger = require('../utils/logger')
const { User } = require('../models/user')
const bcryptjs = require('bcryptjs')


userRouter.get('/', async (request, response) => {
  const users = await User.findAll()
  response.json(users)
})

userRouter.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id)
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

userRouter.post('/', async (request, response) => {
  try {
    const { username, password } = request.body

    if (!username || !password) {
      return response.status(400).json({ error: "Username and password are required" })
    }

    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds) // encrypts the password
    console.log("hashed password:", passwordHash)

    const user = await User.create({
      username,
      password: passwordHash // saves the encrypted password
    })
    console.log("User found:", user)
    response.status(201).json(user) // user saved succesfully
  } catch (error) {
    response.status(400).json({ error: "expected `username` to be unique" })
  }
})

/*try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: "expected `username` to be unique" })
  }
})
*/


module.exports = userRouter