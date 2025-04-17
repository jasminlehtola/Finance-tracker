import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../services/register"

const isPasswordValid = (password) => {
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const isLongEnough = password.length >= 8

  return hasUppercase && hasNumber && isLongEnough
}


const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (event) => {
    event.preventDefault()

    if (!username || !password) {
      alert("Username and password are required.")
      return
    }


    try {
      await registerUser({ username, password })
      alert("Registration successful! You can now log in.")
      console.log("Käyttäjä luotu!")
      navigate("/login")
    } catch (error) {
      if (error.error === "Username is already taken") {
        setErrorMessage("This username is already taken. Please choose another one.")
      } else {
        setErrorMessage(error.error || "Registration failed. Try again.")
      }
    }
  }


  return (
    <div className="page-container">
      <div className="event-container" >
        <h2>Create an account</h2>

        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <div></div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div>
            {password && !isPasswordValid(password) && (
              <p className="password-error">
                Password must be at least 8 characters long, contain one uppercase letter and one number.
              </p>
            )}
            {errorMessage && (
              <div className="form-error">
                {errorMessage}
              </div>
            )}
            <button className="custom-SmallBlueButton" type="submit">Register</button>
            <button className="custom-GreyButton" type="button" onClick={() => navigate("/home")}>Back to Home</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register