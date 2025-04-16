import { useState, useEffect } from 'react'
import React from 'react'
import eventService from '../services/events'
//import { getAccessToken, refreshAccessToken } from '../services/auth'
import NavBar from '../components/navbar'
import AddEvent from '../components/addEvent'
import DeleteEvent from '../components/deleteEvent'
import SummaryBox from "../components/summary"
import MonthMenu from '../components/monthMenu'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


const Frontpage = ({ events, setEvents }) => {
  const currentDate = new Date()
  const defaultMonth = months[currentDate.getMonth()]
  const defaultYear = String(currentDate.getFullYear())

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth)
  const [selectedYear, setSelectedYear] = useState(defaultYear)

  // Etsii kaikki eventit
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await eventService.getAll()
        setEvents(eventsData)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      }
    }
    fetchEvents()
  }, [setEvents])


  // Filtteröi eventit valitut kuukauden/vuoden mukaan
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    const eventMonth = months[eventDate.getMonth()]
    const eventYear = String(eventDate.getFullYear())

    return eventMonth === selectedMonth && eventYear === selectedYear
  })



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
            {events
              .slice() // Luodaan kopio, jotta alkuperäinen data ei muutu
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Järjestetään aikajärjestykseen
              .map(event => {
                // Varmistetaan, että event.id on olemassa
                if (!event.id) {
                  console.error("Event id is missing:", event)
                  return null
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
              })
            }
          </div>
        </div>
      </div>
    )
  }



  return (
    <div>
      < NavBar />
      <div className="page-container">
        < MonthMenu
          events={events}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <SummaryBox events={filteredEvents} />
        <AddEvent events={events} setEvents={setEvents} />

        <div>{mappedEvents(filteredEvents)}</div>
      </div>

    </div>

  )
}

export default Frontpage

