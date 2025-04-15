import React from 'react'
import { useNavigate } from 'react-router-dom'


const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedFinanceTrackerUser')
    navigate('/home')
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
                <a className="nav-link active custom-navbar" aria-current="page" href="/frontpage">Frontpage</a>
                <a className="nav-link custom-navbar" href="/savings">Savings</a>
                <a className="nav-link custom-navbar" href="/graphs">Graphs</a>

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