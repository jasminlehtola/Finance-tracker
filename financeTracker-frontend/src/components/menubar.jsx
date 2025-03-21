import React from 'react'
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { Button, Navbar } from "react-bootstrap"

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
    <button className="custom-logoutButton" onClick={handleLogout}>Logout</button>
  )
}

const MenuBar = () => {
  return (
    <div>
      <nav class="navbar navbar-expand-lg custom-navbar">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link active" aria-current="page" href="/frontpage">Frontpage</a>
              <a class="nav-link" href="#">Saving</a>
              <a class="nav-link" href="/graphs">Graphs</a>
              
            <LogoutButton />
        
            </div>
          </div>
        </div>
      </nav>
      
    </div>
  )
}

export default MenuBar