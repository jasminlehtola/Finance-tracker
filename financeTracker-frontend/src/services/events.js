import axios from 'axios'
import api from './auth'
const baseUrl = '/events'


const getAll = async () => {
  try {
    const response = await api.get(baseUrl)
    return response.data
  } catch (error) {
    console.error("Failed to fetch events:", error)
    throw error
  }
}


const create = async (newObject) => {
  try {
    const response = await api.post(baseUrl, newObject)
    return response.data
  } catch (error) {
    console.error("Failed to create event:", error)
    throw error
  }
}

const remove = async (id) => {
  try {
    const response = await api.delete(`${baseUrl}/${id}`)
    return response.data
  } catch (error) {
    console.error("Failed to delete event:", error)
    throw error
  }
}

const update = async (id, newObject) => {
  try {
    const response = await api.put(`${baseUrl}/${id}`, newObject)
    return response.data
  } catch (error) {
    console.error("Failed to update event:", error)
    throw error
  }
}


export const addNewEvent = async (eventData) => {
  const response = await api.post(baseUrl, eventData)
  return response.data
}


export default { getAll, create, remove, update }


/*
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
          return fetchEvents(newToken) // Kokeillaan uudella tokenilla
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
    */