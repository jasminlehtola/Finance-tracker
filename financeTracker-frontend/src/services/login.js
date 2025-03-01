import axios from 'axios'
import Login from '../pages/login'
import { getAccessToken, refreshAccessToken } from './auth'
const baseUrl = 'http://localhost:3001/api/login'

const login = async (credentials) => {
  console.log("yritetään kirjautua.. pyydetään token backendistä")
  const response = await axios.post(baseUrl, credentials)
  console.log("Vastaus backendistä:", response)

  if (!response.data.accessToken || !response.data.refreshToken) {
    throw new Error("No token received")
  }

  return response.data
}


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async eventObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, eventObject, config)
  return response.data
}

const remove = async (id) => {
  const request = await axios.delete(`${baseUrl}/${id}`)
  console.log('Tapahtuma poistettu')
  return request.then(response => response.data)
}

const update = async (id, eventObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, eventObject)
  console.log('Tapahtuma päivitetty')
  return response.data
}

export default { login, setToken, getAll, create, remove, update }