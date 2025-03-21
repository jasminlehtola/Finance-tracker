
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import React from 'react'
import eventService from '../services/events'
import { getAccessToken, refreshAccessToken } from '../services/auth'
import MenuBar from '../components/menubar'
import AddEvent from '../components/addEvent'
import DeleteEvent from '../components/deleteEvent'



const Frontpage = ({ user, events, setEvents }) => {
  const navigate = useNavigate()
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
  console.log("alkuperäiset eventit:", events)


  // Laskee kokonaistulot
  const totalIncome = events
    .filter(event => event.is_income === true) // Suodatetaan vain income-tapahtumat
    .reduce((sum, event) => sum + Math.abs(event.sum), 0) // Lasketaan yhteen absoluuttiset summat

  // Laskee kokonaismenot
  const totalExpenses = events
    .filter(event => event.is_income === false) // Suodatetaan vain expense-tapahtumat
    .reduce((sum, event) => sum + Math.abs(event.sum), 0)

  // Laskee tulot-menot
  const balance = Math.round((totalIncome - totalExpenses) * 100) / 100



  const mappedEvents = (events) => {
    if (!events || events.length === 0) {
      return <p>No events found.</p>
    }

    return (
      <div>
        <div className="event-container">

          <div className="event-header">
            <span>Sum</span>
            <span>Category</span>
            <span>Description</span>
            <span>Date</span>
          </div>

          <div className="event-container">
            {events.map(event => {
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
                <li key={event.id} className="event-item">
                  <div className="event-data">{event.sum}€</div>
                  <div className="event-data">{event.category}</div>
                  <div className="event-data">{event.title}</div>
                  <div className="event-data">{event.date}</div>
                  <div>
                    <DeleteEvent eventId={event.id} setEvents={setEvents} events={events} />
                  </div>
                </li>
              )
            })}
          </div>
        </div>

        <div className="summary-container">
          <div className="summary-item title">Incomes:</div>
          <div className="summary-item value">{totalIncome} €</div>

          <div className="summary-item title">Expenses:</div>
          <div className="summary-item value">{totalExpenses} €</div>

          <div className="summary-item title">Balance:</div>
          <div className="summary-item value">{balance} €</div>
        </div>
      </div>


    )
  }



  return (
    <div className="container mt-4">
      < MenuBar />
      <h3>Welcome to your dashboard {user?.username}!</h3>
      <AddEvent events={events} setEvents={setEvents}/>

      <h2>Event List</h2>
      <ul>{mappedEvents(events)}</ul>

    </div>

  )
}

export default Frontpage

