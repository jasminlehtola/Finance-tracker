import { useState, useEffect, useRef } from 'react'
import eventService from './services/events'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const Frontpage = () => (
  <div> <h2>Frontpage</h2> </div>
)

const Savings = () => (
  <div> <h2>Savings</h2> </div>
)

const Graphs = () => (
  <div> <h2>Graphs</h2> </div>
)


const App = () => {
  const padding = {
    padding: 15
  }

  const [events, setEvents] = useState([])

  // searches all the events
  useEffect(() => {
    eventService.getAll().then(events =>
      setEvents(events)
    )
    console.log("printing events")
  }, [])


const mappedEvents = () => {
  return events.map(event => {
    if (event.income) {
      event.sum = Math.abs(event.sum);  // Makes sure that the sum is positive
    } else if (event.expense) {
      event.sum = -Math.abs(event.sum); // Transforms sum into a negative number
    }
  return (
    <li key={event.id}>
      {event.sum}€ - category: {event.category} - description: {event.content} - date: {event.date}
    </li>
  )
})
}

  
  return (
    <Router>
      <div>
        <Link style={padding} to="/">frontpage</Link>
        <Link style={padding} to="/savings">savings</Link>  
        <Link style={padding} to="/graphs">graphs</Link>
      </div>

      <Routes>
        <Route path="/savings" element={<Savings />} />
        <Route path="/graphs" element={<Graphs />} />
        <Route path="/" element={<Frontpage />} />
      </Routes>

      <div>
        <i>Stay on track with your monthly finances</i>
      </div>
      <div>
      <h1>Event List</h1>
      <ul>{mappedEvents()}</ul>
    </div>
    </Router>
  )
}


export default App