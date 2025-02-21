
import { useNavigate } from "react-router-dom"


import { useState, useEffect } from 'react'
import eventService from '../services/events'
import MenuBar from '../components/menubar'




  const mappedEvents = (events) => {
    return events.map(event => {
      if (event.type == "income") {
        event.sum = Math.abs(event.sum);  // Makes sure that the sum is positive
      } else  {
        event.sum = -Math.abs(event.sum); // Transforms sum into a negative number
      }
    return (
      <li key={event.id}>
        {event.sum}€ - category: {event.category} - description: {event.title} - date: {event.date}
      </li>
    )
  })
  }


const Frontpage = () => {
const [username, setUsername] = useState("")
const [password, setPassword] = useState("")
const navigate = useNavigate()

const [events, setEvents] = useState([])
const [user, setUser] = useState(null); // Tallennetaan käyttäjätiedot


  // searches all the events
  useEffect(() => {
    eventService.getAll().then(events => {
      console.log("Data from backend:", events);
      setEvents(events)
  })
    console.log("printing events..")
  }, [])


return (
  <div>
    < MenuBar />
      <h1>Event List</h1>
      <ul>{mappedEvents(events)}</ul>
    </div>
    
)
}

export default Frontpage

