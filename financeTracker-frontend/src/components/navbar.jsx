import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedFinanceTrackerUser')
    window.localStorage.removeItem('refreshToken')
    window.localStorage.removeItem('accessToken')
    navigate('/')
    console.log("Logged out user")
  }

  return (
    <button className="custom-logoutButton" onClick={handleLogout}>Logout</button>
  )
}

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div>
      <div className="navbar-container">
        <nav className="navbar navbar-expand-lg custom-navbar">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleMenu}
              aria-controls="navbarNav"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
              <div className="navbar-nav custom-navbar d-flex flex-column flex-lg-row">
                <Link className="nav-link active custom-navbar" aria-current="page" to="/frontpage">Frontpage</Link>
                <Link className="nav-link custom-navbar" to="/savings">Savings</Link>
                <Link className="nav-link custom-navbar" to="/graphs">Graphs</Link>

                <LogoutButton />

              </div>
            </div>
          </div>
        </nav>
      </div>

    </div>
  )
}

export default NavBar