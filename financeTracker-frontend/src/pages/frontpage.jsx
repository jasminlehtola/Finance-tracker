
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import eventService from '../services/events'
import { getAccessToken, refreshAccessToken } from '../services/auth'
import MenuBar from '../components/menubar'
import AddEvent from '../components/addEvent'

import React from 'react'
import { Modal, Button, Form , Toast, Dropdown, Col, Row} from "react-bootstrap"



const Frontpage = ({ user, events, setEvents }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()


  const mappedEvents = (events) => {
    if (!events || events.length === 0) {
      return <li>No events found.</li>
    }

    return events.map(event => {
      if (event.type === "income") {
        event.sum = Math.abs(event.sum);  // Pitää huolen, että summa on positiivinen
      } else {
        event.sum = -Math.abs(event.sum); // Muuttaa summan negatiiviseksi
      }
      return (
        <li key={event.id}>
          {event.sum}€ - category: {event.category} - description: {event.title} - date: {event.date}
        </li>
      )
    })
  }

  const { id } = useParams()  // Haetaan käyttäjän ID URL:sta
  console.log("Käyttäjän ID:", id)


  // Etsii kaikki eventit
  useEffect(() => {
    const fetchEvents = async () => {
      const data = await eventService.getAll()
      if (data) {
        setEvents(data)
      }
    }

    fetchEvents()
  }, [])


  const [show, setShow] = useState(true)
  const toggleShow = () => setShow(!show)

  return (
    <div className="container mt-4">
      < MenuBar />
      <h2>Welcome to your dashboard!</h2>
      <AddEvent />
  
      <h1>Event List</h1>
      <ul>{mappedEvents(events)}</ul>
      
    </div>

  )
}

export default Frontpage

