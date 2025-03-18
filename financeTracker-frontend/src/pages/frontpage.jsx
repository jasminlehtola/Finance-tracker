
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import React from 'react'
import eventService from '../services/events'
import { getAccessToken, refreshAccessToken } from '../services/auth'
import MenuBar from '../components/menubar'
import AddEvent from '../components/addEvent'
import DeleteEvent from '../components/deleteEvent'



const Frontpage = ({ user, events, setEvents }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [editEvent, setEditEvent] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [show, setShow] = useState(true)
  const toggleShow = () => setShow(!show)

  // Etsii kaikki eventit
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await eventService.getAll()
        setEvents(eventsData);
      } catch (error) {
        console.error("Failed to fetch events:", error)
      }
    }
    fetchEvents()
  }, [setEvents])



  const mappedEvents = (events) => {
    if (!events || events.length === 0) {
      return <li>No events found.</li>
    }


    return events.map(event => {
      // Varmistetaan, että event.id on olemassa
      if (!event.id) {
        console.error("Event id is missing:", event);
        return null;
      }
      if (event.is_income === true) {
        event.sum = Math.abs(event.sum) // Pitää huolen, että summa on positiivinen
      } if (event.is_income === false) {
        event.sum = -Math.abs(event.sum) // Muuttaa summan negatiiviseksi
      }
      return (
        <li key={event.id}>
          {event.sum}€ - category: {event.category} - description: {event.title} - date: {event.date}
          <DeleteEvent eventId={event.id} setEvents={setEvents} events={events} />
        </li>
      )
    })
  }



  return (
    <div className="container mt-4">
      < MenuBar />
      <h2>Welcome to your dashboard {user?.username}!</h2>
      <AddEvent />

      <h1>Event List</h1>
      <ul>{mappedEvents(events)}</ul>

    </div>

  )
}

export default Frontpage

