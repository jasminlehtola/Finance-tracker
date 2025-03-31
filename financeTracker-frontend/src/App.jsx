import { useState, useEffect, useRef } from 'react'
import eventService from './services/events'
import Login from "./pages/login"
import Home from "./pages/home"
import Register from "./pages/register"
import Frontpage from "./pages/frontpage"
import Savings from "./pages/savings"
import "./styles.css"

import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate
} from 'react-router-dom'



const App = () => {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Yritetään lukea käyttäjätiedot localStoragesta
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedFinanceTrackerUser'))
    console.log("Localstoragessa tiedot:", loggedUser)
    if (loggedUser) {
      setUser(loggedUser)
    }
  }, [])


  return (
    <div>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/frontpage" element={<Frontpage user={user} events={events} setEvents={setEvents}/>} />
          <Route path="/frontpage/:id" element={<Frontpage user={user} events={events} setEvents={setEvents}/>} />
          <Route path="/login" element={<Login user={user} setUser={setUser}/>} />
          <Route path="/savings" element={<Savings events={events} setEvents={setEvents}/>} />
        </Routes>
      </Router>
    </div>
  )
}


export default App