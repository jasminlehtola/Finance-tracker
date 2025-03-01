import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/users'

export const registerUser = async (userData) => {
    try {
      const response = await axios.post(baseUrl, userData)
      return response.data // Returns information from registered user
    } catch (error) {
      throw error.response?.data || error.message
    }
  }


/* const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
  }
  
  const create = newObject => {
    return axios.post(baseUrl, newObject)
  }
  

  export default { 
    getAll: getAll, 
    create: create
  }
    */
