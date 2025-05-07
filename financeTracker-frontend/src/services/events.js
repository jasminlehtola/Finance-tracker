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

