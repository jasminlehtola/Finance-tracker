import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../services/register"
import NavBar from '../components/navbar'
import axios from 'axios'


const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      await registerUser({ username, password })
      alert("Registration successful! You can now log in.")
      console.log("Käyttäjä luotu!")
      navigate("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      alert(`Error: ${error.error || "Registration failed. Try again."}`)
    }
  };


  return (
    <div>
    < NavBar />
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <button onClick={() => navigate("/home")}>Back to Home</button>
    </div>
  )
}

export default Register