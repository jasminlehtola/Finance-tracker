import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
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
      const response = await axios.post('http://localhost:3001/api/login/refresh', {
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
    //***const originalRequest = error.config

    //***if (error.response.status === 403 && !originalRequest._retry) {
    if (error.response && error.response.status === 403) {
      //***originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        console.error('No refresh token available')
        console.log('Redirecting to /login... NUMBER 3')
        setTimeout(() => {
          window.location.href = '/login'
        }, 15000)
        return Promise.reject(error)
      }

      // ***jos ei toimi, kokeile laittaa api.post
      try {
        const response = await axios.post('/login/refresh', {
          refreshToken: refreshToken,
        })

        localStorage.setItem('accessToken', response.data.accessToken)
        //***originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        //return axios(originalRequest)
        //***return api(originalRequest)

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


/*
// Lisää tokenin kaikkiin pyyntöihin automaattisesti
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})
  */


export default api


//vimeisin toimiva
/*// Interceptor pyytää aina uutta access tokenia, jos nykyinen on vanhentunut
api.interceptors.response.use(
  response => response, // Jos pyyntö onnistuu, palauta vastaus suoraan
  async error => {
    const originalRequest = error.config

    // Tarkistetaan, onko virhe 403, eli token on vanhentunut
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      // Hakee refresh tokenin localStorage:sta
      console.log("Haetaan refreshtoken")
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        console.error("No refresh token available")
        window.location.href = '/login' // Redirect to login if no refresh token exists
        return Promise.reject(error)
      }

      // Pyytää uuden accesstokenin refreshtokenilla
      try {
        const response = await axios.post('http://localhost:3001/api/auth/refresh', {
          refreshToken: refreshToken,
        })

        const { accessToken } = response.data

        console.log("Refresh token used - new access token acquired")

        // Tallentaa uuden accesstokenin
        localStorage.setItem('accessToken', accessToken)

        // Toistaa alkuperäisen pyynnön uudella accesstokenilla
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return axios(originalRequest)
      } catch (error) {
        console.error("Refresh token failed:", error)
        // Jos refreshtokeniä ei voi käyttää, ohjaa käyttäjän kirjautumaan sisään uudelleen
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error) // Jos ei ole 403 virhe, heittää virheen eteenpäin
  }
)


// Lisää tokenin kaikkiin pyyntöihin automaattisesti
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})


export default api
*/



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
