import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  console.log("yritetään kirjautua.. pyydetään token backendistä")
  const response = await axios.post(baseUrl, credentials)
  console.log("Vastaus backendistä:", response)

  if (!response.data.accessToken || !response.data.refreshToken) {
    throw new Error("No token received")
  }

  return response.data
}

export default { login }

