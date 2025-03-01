import React from 'react'
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'

const padding = {
  padding: 10
}

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Removes user info from localStorage
    window.localStorage.removeItem('loggedFinanceTrackerUser')

    navigate('/home')
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}

const MenuBar = () => {
return (
    <div>
        <Link style={padding} to="/login">login</Link>
        <Link style={padding} to="/register">register</Link>  
        <Link style={padding} to="/graphs">graphs</Link>
        <LogoutButton />
      </div>
)
}

export default MenuBar