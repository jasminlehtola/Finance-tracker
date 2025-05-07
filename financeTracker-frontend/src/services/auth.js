import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const baseURL = '/api'


const api = axios.create({
  baseURL: baseURL,
})

// Apufunktio tarkistaa, onko token vanhentunut
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token) // Decodaa tokenin ja näyttää vanhenemisajan
    const currentTime = Math.floor(Date.now() / 1000) // Nykyinen aika sekunteina
    return exp < currentTime // Token on vanhentunut, jos exp on pienempi kuin nykyinen aika
  } catch (error) {
    console.error('Error decoding token:', error)
    return true // Oletetaan tokenin vanhentuneen jos dekoodauksessa tapahtuu virhe
  }
}

// Interceptor pyytää aina uutta access tokenia, jos nykyinen on vanhentunut
api.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (accessToken && isTokenExpired(accessToken)) {
    console.log('Accesstoken on vanhentunut, refreshataan...')
    if (!refreshToken) {
      console.error('No refresh token available')
      console.log('Redirecting to /login... NUMBER 1')
      setTimeout(() => {
        window.location.href = '/login'
      }, 15000)
      return Promise.reject(new Error('No refresh token available'))
    }

    try {
      const response = await axios.post(`${baseURL}/login/refresh`, {
        refreshToken: refreshToken,
      })
      console.log(response)
      accessToken = response.data.accessToken
      localStorage.setItem('accessToken', accessToken)
      console.log('Accesstoken refeshattu onnistuneesti')
    } catch (error) {
      console.error('Failed to refresh access token:', error)
      console.log('Redirecting to /login... NUMBER 2')
      setTimeout(() => {
        window.location.href = '/login'
      }, 15000)
      return Promise.reject(error)
    }
  }

  // Lisää tokenin kaikkiin pyyntöihin automaattisesti
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return config

}, (error) => {
  return Promise.reject(error)
})

// Interceptor käsittelee 403 virheet ja yrittää uusia accesstokenin
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    if (error.response && error.response.status === 403) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        console.error('No refresh token available')
        console.log('Redirecting to /login... NUMBER 3')
        setTimeout(() => {
          window.location.href = '/login'
        }, 15000)
        return Promise.reject(error)
      }

     
      try {
        const response = await axios.post('/login/refresh', {
          refreshToken: refreshToken,
        })

        localStorage.setItem('accessToken', response.data.accessToken)
    

        error.config.headers['Authorization'] = `Bearer ${response.data.accessToken}`
        return api.request(error.config)

      } catch (error) {
        console.error('Refresh token failed:', error)
        console.log('Redirecting to /login... NUMBER 4')
        setTimeout(() => {
          window.location.href = '/login'
        }, 15000)
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)




export default api

