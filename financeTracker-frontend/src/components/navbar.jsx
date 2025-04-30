import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedFinanceTrackerUser')
    window.localStorage.removeItem('refreshToken')
    window.localStorage.removeItem('accessToken')
    navigate('/home')
    console.log("Logged out user")
  }

  return (
    <button className="custom-logoutButton" onClick={handleLogout}>Logout</button>
  )
}

const NavBar = () => {
  return (
    <div>
      <div className="navbar-container">
        <nav className="navbar navbar-expand-lg custom-navbar">
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
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