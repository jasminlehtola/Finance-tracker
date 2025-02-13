const eventsRouter = require('express').Router()
const logger = require('../utils/logger')
const config = require('../utils/config')
const { Event } = require('../models/event')
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()


eventsRouter.get('/', async (req, res) => {
  const events = await Event.findAll()
  res.json(events)
})

eventsRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const event = await Event.findByPk(id) // Searches single event based on id
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
  

module.exports = eventsRouter
  
 