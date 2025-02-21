import { useNavigate } from "react-router-dom"


const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Welcome to the Finance App</h1>
      <p>Manage your income and expenses easily!</p>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  )
}
export default Home