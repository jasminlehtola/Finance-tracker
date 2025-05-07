import axios from 'axios'
const baseUrl = '/api/users'

export const registerUser = async (userData) => {
    try {
      const response = await axios.post(baseUrl, userData)
      return response.data 
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
