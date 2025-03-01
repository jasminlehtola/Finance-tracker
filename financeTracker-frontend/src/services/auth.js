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
    const { accessToken } = response.data

    // Päivitetään localStorage uudella accessTokenilla
    user.accessToken = accessToken
    window.localStorage.setItem('loggedFinanceTrackerUser', JSON.stringify(user))

    return accessToken
  } catch (error) {
    console.error('Error refreshing token', error)
    return null
  }
};

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
