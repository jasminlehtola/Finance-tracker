import { Link } from "react-router-dom"

const padding = {
  padding: 10
}

const MenuBar = () => {
return (
    <div>
        <Link style={padding} to="/login">login</Link>
        <Link style={padding} to="/register">register</Link>  
        <Link style={padding} to="/graphs">graphs</Link>
      </div>
)
}

export default MenuBar