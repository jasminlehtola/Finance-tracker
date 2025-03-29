import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
})

// Interceptor pyytää aina uutta access tokenia, jos nykyinen on vanhentunut
api.interceptors.response.use(
  response => response, // Jos pyyntö onnistuu, palauta vastaus suoraan
  async error => {
    const originalRequest = error.config
    
    // Tarkistetaan, onko virhe 403, eli token on vanhentunut
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true

      // Hae refresh token localStorage:sta
      const refreshToken = localStorage.getItem('refreshToken')
      
      // Pyydä uusi access token refresh tokenilla
      try {
        const response = await axios.post('http://localhost:3001/api/auth/refresh', {
          refreshToken: refreshToken,
        })
        
        const { accessToken } = response.data
        
        // Tallenna uusi access token
        localStorage.setItem('accessToken', accessToken)
        
        // Toista alkuperäinen pyyntö uudella access tokenilla
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return axios(originalRequest)
      } catch (error) {
        console.error("Refresh token failed:", error)
        // Jos refresh tokeniä ei voi käyttää, ohjaa käyttäjä kirjautumaan sisään uudelleen
        window.location.href = '/login' // Ohjaa kirjautumissivulle
      }
    }

    return Promise.reject(error) // Jos ei ole 403 virhe, heitä virhe eteenpäin
  }
)

export default api


/*
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/refresh'

// Haetaan käyttäjän accessToken localStoragesta
const getAccessToken = () => {
  const user = JSON.parse(window.localStorage.getItem('loggedFinanceTrackerUser'))
  return user ? user.accessToken : null
}

// Päivitetään pääsytunnus refresh tokenilla
const refreshAccessToken = async () => {
  const user = JSON.parse(window.localStorage.getItem('loggedFinanceTrackerUser'))
  const refreshToken = user ? user.refreshToken : null

  if (!refreshToken) {
    console.log('No refresh token available')
    return null
  }

  try {
    const response = await axios.post(baseUrl, { refreshToken })

    // Päivitetään localStorage uudella accessTokenilla
    if (response.status === 200) {
      const newAccessToken = response.data.accessToken
      user.accessToken = newAccessToken
      window.localStorage.setItem("loggedFinanceTrackerUser", JSON.stringify(user))
      return newAccessToken
    }
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

// Tehdään API-pyyntö pääsytunnuksella (automaattisesti päivittää tokenin, jos se on vanhentunut)
const fetchData = async (url) => {
  let accessToken = getAccessToken()

  // Jos token on vanhentunut, yritetään uudelleenlataustunnusta
  if (!accessToken) {
    accessToken = await refreshAccessToken()
  }

  if (!accessToken) {
    console.log('User is not authenticated')
    return
  }

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return response.data
  } catch (error) {
    console.log('Error fetching data', error)
    return null
  }
}

export { getAccessToken, refreshAccessToken, fetchData }
*/
