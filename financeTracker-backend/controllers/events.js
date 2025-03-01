const eventsRouter = require('express').Router()
const logger = require('../utils/logger')
const { Event } = require('../models/event')
const jwt = require('jsonwebtoken')
const authenticateToken = require('../middleware/auth')
const { SECRET } = require('../utils/config')


// Käytetään autentikointimiddlewarea auth.js
eventsRouter.get('/', authenticateToken, async (request, response) => {
  try {
    console.log("Etsitään eventit..")
    console.log("request.user:", request.user)
    const events = await Event.findAll({ where: { user_id: request.user.id } }) 
    response.json(events)
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch events' })  
  }
})



/*eventsRouter.get('/', async (req, res) => {
  const events = await Event.findAll()
  res.json(events)
})

eventsRouter.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id) // Searches single event based on id
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }
    res.json(event)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
  


eventsRouter.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body)
    return res.json(event)
  } catch(error) {
    return res.status(400).json({ error })
  }
})


eventsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type, sum, category, title, date } = req.body

    // Finds event from database
    const event = await Event.findByPk(id)

    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    // Updates event with PUT-method (updates only given values)
    await event.update({
      type,
      sum,
      category,
      title,
      date
    })

    res.json(event) // Returns updated event
  } catch (error) {
    console.error("Error updating event:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})


eventsRouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    // Finds the event and deletes it from the database
    const deletedEvent = await Event.destroy({
      where: { id: id }
    });

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" })
    }

    logger.info("Deleted event number", id)
    res.status(204).end()
  } catch (error) {
    console.error("Error deleting event:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})
  
*/

module.exports = eventsRouter
  
 