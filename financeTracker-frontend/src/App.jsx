import { useState, useEffect, useRef } from 'react'
import eventService from './services/events'
import Login from "./pages/login"
import Home from "./pages/home"
import Register from "./pages/register"
import Frontpage from "./pages/frontpage"

import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate
} from 'react-router-dom'



const App = () => {
  const padding = {
    padding: 15
  }

  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null); // Tallennetaan käyttäjätiedot

  
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/frontpage" element={<Frontpage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}


export default App