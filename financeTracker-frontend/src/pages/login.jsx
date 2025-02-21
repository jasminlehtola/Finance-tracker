import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Frontpage from "./frontpage"
import MenuBar from '../components/menubar'
import loginService from '../services/login'
import eventService from '../services/events'


const Login = ({ setUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setMessage] = useState('')
  const navigate = useNavigate()


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username)
  
    try {
      const loginCredentials = { username: username, password: password }
      const user = await loginService.login(loginCredentials)
  
      // Tekee kirjautumisesta "pysyvän" local storagen avulla.
      window.localStorage.setItem(
        'loggedFinanceTrackerUser', JSON.stringify(user)
      )
  
      eventService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
    navigate("/frontpage") // Ohjaa käyttäjän etusivulleen
  }

  return (
    <div>
      < MenuBar />
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login