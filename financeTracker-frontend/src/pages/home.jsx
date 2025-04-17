import { useNavigate } from "react-router-dom"


const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <div className="event-container" >
        <h2>Welcome to the Finance App</h2>
        <p>Manage your incomes and expenses easily!</p>
        <button className="custom-BigBlueButton" onClick={() => navigate("/login")}>Login</button>
        <button className="custom-BigBlueButton" onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  )
}
export default Home