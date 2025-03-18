import axios from 'axios'
import { getAccessToken, refreshAccessToken } from './auth'
const baseUrl = 'http://localhost:3001/api/events'


const logoutUser = () => {
  window.localStorage.removeItem("loggedFinanceTrackerUser")
  window.location.reload() // Uudelleenohjataan kirjautumiseen
}


const getAll = async () => {
  const userJSON = window.localStorage.getItem('loggedFinanceTrackerUser')

  // Jos userJSON on null, käyttäjä ei ole kirjautunut sisään.
  if (!userJSON) {
    console.error("No user data found in localStorage")
    throw new Error("No user data found in localStorage")
  }

  // Muuntaa tekstimuotoisen datan JavaScript-olioksi.
  const user = JSON.parse(userJSON)

  // Jos käyttäjän tiedoista ei löydy accessToken-kenttää, kirjautuminen on epäonnistunut 
  if (!user.accessToken) {
    console.error("No accessToken found in user data")
    throw new Error("No accessToken found in user data")
  }

  // Haetaan token käyttäjäoliosta
  const token = user.accessToken

  
  const fetchEvents = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      console.log("Fetching events with config:", config)
      const response = await axios.get(baseUrl, config)
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Access token expired, trying to refresh...")
        const newToken = await refreshAccessToken()
        if (newToken) {
          return fetchEvents(newToken); // Kokeillaan uudella tokenilla
        } else {
          console.error("Token refresh failed, logging out user.")
          logoutUser()
        }
      }
      throw error
    }
  }

  return fetchEvents(token)
}

  const create = newObject => {
    return axios.post(baseUrl, newObject)
  }

  const remove = eventId => {
    return axios.delete(baseUrl, eventId)
  }
  
  const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
  }
  
  export default { 
    getAll: getAll, 
    create: create, 
    remove: remove,
    update: update 
  }