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
      <div class="navbar-container">
        <nav class="navbar navbar-expand-lg custom-navbar">
          <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div class="navbar-nav">
                <a class="nav-link active custom-navbar" aria-current="page" href="/frontpage">Frontpage</a>
                <a class="nav-link custom-navbar" href="/savings">Savings</a>
                <a class="nav-link custom-navbar" href="/graphs">Graphs</a>

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