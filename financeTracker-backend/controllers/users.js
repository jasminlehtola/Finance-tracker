const userRouter = require('express').Router()
const logger = require('../utils/logger')
const { User } = require('../models/user')


userRouter.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
  })

userRouter.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).end()
    }
  }) 

userRouter.post('/', async (req, res) => {
    try {
      const user = await User.create(req.body)
      res.json(user)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })
  

  
  module.exports = userRouter