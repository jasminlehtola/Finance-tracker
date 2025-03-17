import axios from 'axios'
import { getAccessToken, refreshAccessToken } from './auth'
const baseUrl = 'http://localhost:3001/api/events'


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

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    console.log("Fetching events with config:", config)
    const response = await axios.get(baseUrl, config)  
    console.log("Haettu data:", response)
    return response.data
  } catch (error) {
    console.error("Error fetching events", error)
    throw error
  }
}

  /*let accessToken = getAccessToken()

  if (!accessToken) {
    accessToken = await refreshAccessToken()
  }

  if (!accessToken) {
    console.log('User is not authenticated')
    return
  }

  const token = accessToken

  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    console.log("Sending token:", token)  

    const response = await axios.get(baseUrl, config)
    return response.data
  } catch (error) {
    console.error('Error fetching events', error)
    return null
  }
}
  */

  
  const create = newObject => {
    return axios.post(baseUrl, newObject)
  }
  
  const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
  }
  
  export default { 
    getAll: getAll, 
    create: create, 
    update: update 
  }