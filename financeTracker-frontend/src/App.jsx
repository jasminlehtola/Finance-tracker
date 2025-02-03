import { useState } from 'react'
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
    padding: 5
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
    </Router>
  )
}

export default App