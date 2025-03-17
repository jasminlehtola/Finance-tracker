import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Frontpage from "./frontpage"
import MenuBar from '../components/menubar'
import loginService from '../services/login'
import eventService from '../services/events'


const Notification = ({ message, isError }) => {
  if (!message) return null; // Ei näytetä mitään, jos viestiä ei ole

  return (
    <div className={isError ? "error" : "success"}>
      {message}
    </div>
  )
}


const Login = ({ user, setUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("Lähetetään kirjautumispyyntö...")

    // Tarkastaa, että käyttäjänimi tai salasana eivät ole tyhjiä
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username and password are required')

      setTimeout(() => {
        console.log("Error message given")
        setErrorMessage('')
      }, 5000)
      return
    }

    try {
      const loginCredentials = { username: username, password: password }
      const user = await loginService.login(loginCredentials) // Pyytää tokenin backendistä
      console.log("Saatiin vastaus, login.js valmis:", user)

      /* if (!user || !user.token) {
        throw new Error("Login failed: No token received")
      }
        */

      console.log("Credentialit tehty, kirjautuminen onnistui!")

      // Tallentaa kirjautumistiedot localStorageen
      window.localStorage.setItem(
        'loggedFinanceTrackerUser', JSON.stringify(user)
      )
      console.log("Kirjautumistiedot localstoragessa", window.localStorage.getItem('loggedFinanceTrackerUser') )

      setUser(user)
      setUsername('')
      setPassword('')
      console.log('User logged in:', user)
      navigate(`/frontpage/${user.id}`)
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  /*loginService.setToken(user.token) // Asettaa tokenin palvelukutsuihin
  setUser(user)
  setUsername('')
  setPassword('')
  navigate(`/frontpage/${user.id}`) 
  console.log('logging in with', username)
} catch (error) {
  console.error("Login error:", error)
  setErrorMessage('Wrong username or password')
  setTimeout(() => {
    setErrorMessage('')
  }, 5000)
}
  */



  return (
    <div>
      <MenuBar />

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
      <Notification message={errorMessage} isError={true} />
    </div>
  )
}

export default Login