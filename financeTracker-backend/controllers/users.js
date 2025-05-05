const userRouter = require('express').Router()
const logger = require('../utils/logger')
const { User } = require('../models/user')
const bcryptjs = require('bcryptjs')


const passwordIsValid = (password) => {
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const isLongEnough = password.length >= 8

  return hasUppercase && hasNumber && isLongEnough
}


userRouter.get('/', async (request, response) => {
  const users = await User.findAll({attributes: { exclude: ['password'] }})
  response.json(users)
})

userRouter.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id, {attributes: { exclude: ['password'] }})
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

    if (!passwordIsValid(password)) {
      return response.status(400).json({
        error: "Password must be at least 8 characters long and include one uppercase letter and one number"
      })
    }

    const existingUser = await User.findOne({ where: { username: username } })
    if (existingUser) {
      console.log("Existing user:", existingUser)
      return response.status(400).json({ error: "Username is already taken" })
    }

    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds) // salaa salasanan
    console.log("hashed password:", passwordHash)

    const user = await User.create({
      username,
      password: passwordHash // tallentaa salatun salasanan
    })
    console.log("User found:", user)
    response.status(201).json(user)
  } catch (error) {
    response.status(400).json({ error: "expected `username` to be unique" })
  }
})



module.exports = userRouter