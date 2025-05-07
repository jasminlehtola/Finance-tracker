import { useState } from "react"
import { useNavigate } from "react-router-dom"
import loginService from '../services/login'


const Notification = ({ message, isError }) => {
  if (!message) return null // Ei näytetä mitään, jos viestiä ei ole

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
        setErrorMessage('')
      }, 5000)
      return
    }


    try {
      const data = await loginService.login({
        username,
        password
      })

      
      const { accessToken, refreshToken, ...userData } = data

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("loggedFinanceTrackerUser", JSON.stringify(userData))

      console.log(window.localStorage.getItem('loggedFinanceTrackerUser'))
      console.log("Credentialit tehty, kirjautuminen onnistui!")
      console.log('User logged in:', userData)
      setUser(userData)
      navigate(`/frontpage/${userData.id}`)
    } catch (error) {
      console.error("Login failed:", error)
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

    


  return (
    <div className="page-container">
      <div className="event-container" >
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
          <button className="custom-BigBlueButton" type="submit">Login</button>
          <button className="custom-GreyButton" onClick={() => navigate("/")}>Back to Home</button>
        </form>
        <Notification message={errorMessage} isError={true} />
      </div>
    </div>
  )
}

export default Login