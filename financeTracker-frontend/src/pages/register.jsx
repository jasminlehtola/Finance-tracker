import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MenuBar from '../components/menubar'


const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleRegister = (event) => {
    event.preventDefault()
    console.log("User registered:", username);
    navigate("/login")
  };

  return (
    <div>
    < MenuBar />
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  )
}

export default Register