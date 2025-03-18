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

    const events = await Event.findAll({ where: { "user_id": request.user.id } })
    console.log("eventit:", events)
    response.json(events)
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch events' })
  }
})

eventsRouter.post('/', authenticateToken, async (request, response) => {
  try {
    console.log("Postataan tapahtumaa..")
    console.log("Authorization header:", request.headers.authorization)
    console.log("request body:", request.body)
    const event = await Event.create(request.body)
    console.log("Lisätty tapahtuma:", event)
    return response.json(event)
  } catch (error) {
    return response.status(400).json({ error })
  }
})


eventsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { is_income, sum, category, title, date } = req.body

    // Etsii eventin tietokannasta
    const event = await Event.findByPk(id)

    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    await event.update({
      is_income,
      sum,
      category,
      title,
      date
    })

    res.json(event)
  } catch (error) {
    console.error("Error updating event:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})


eventsRouter.delete('/:id', async (request, response) => {
  try {
    const eventId = request.params.id
    // Etsii eventin tietokannasta ja poistaa sen
    const deletedEvent = await Event.destroy({where: { id: eventId }})

    if (deletedEvent) {
      logger.info("Deleted event number", eventId)
      response.status(200).json({ message: 'Event deleted successfully.' })
    } else {
      response.status(404).json({ message: 'Event not found.' })
    }

  } catch (error) {
    console.error("Error deleting event:", error)
    response.status(500).json({ error: "Internal server error" })
  }
})




module.exports = eventsRouter

