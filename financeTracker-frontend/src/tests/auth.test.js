import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import api from '../services/auth'

describe('auth.js', () => {
  let mock

  // Mock localStorage
  const localStorageMock = (() => {
    let store = {}
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString()
      },
      removeItem: (key) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
    }
  })()

  beforeAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
    })

    // Mock window.location
    Object.defineProperty(global, 'window', {
      value: {
        location: {
          href: '',
        },
      },
      writable: true,
    })
  })

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
    window.location.href = '' // Reset the href before each test
  })

  afterEach(() => {
    mock.restore()
  })

  it('should retry the request with a new access token when the access token is expired', async () => {
    // Create simple expired accesstoken (exp = 1000)
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJleHAiOjEwMDAwMDAwMDB9.' +
      'signature'

    // fresh-token 
    const freshToken = 'eyJhbGcryhYhjiJIUzI1NiIsInR5yhkolkIkERVCJ9.' +
      'eyJleTyuhjEwMDArfvEDRB9.' +
      'signature'

    // Mock localStorage
    localStorage.setItem('accessToken', expiredToken)
    localStorage.setItem('refreshToken', freshToken)

    // Mock the initial request that fails with 403
    mock.onGet('/protected-resource').replyOnce(403)

    // Mock the refresh token request
    mock.onPost('login/refresh').replyOnce(200, {
      accessToken: 'freshToken',
    })

    // Mock the retried request with the new access token
    mock.onGet('/protected-resource').replyOnce(200, { data: 'success' })

    // Make the API call
    const response = await api.get('/protected-resource')

    // Assertions
    expect(response.data).toEqual('success')
    expect(localStorage.getItem('accessToken')).toEqual('refreshToken')
  })

  it('should redirect to login when the refresh token is invalid or expired', async () => {
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJleHAiOjEwMDAwMDAwMDB9.' +
      'signature'

      const freshToken = 'eyJhbGcryhYhjiJIUzI1NiIsInR5yhkolkIkERVCJ9.' +
      'eyJleTyuhjEwMDArfvEDRB9.' +
      'signature'

    jest.useFakeTimers()

    // Mock localStorage
    localStorage.setItem('accessToken', expiredToken)
    localStorage.setItem('refreshToken', freshToken)

    // Mock the initial request that fails with 403
    mock.onGet('/protected-resource').replyOnce(403)
    // Mock the refresh token request that fails
    mock.onPost('/login/refresh').replyOnce(401)

    // Make the API call and expect it to fail
    await expect(api.get('/protected-resource')).rejects.toThrow()

    jest.runAllTimers()

    // Assertions
    expect(window.location.href).toEqual('/login')
  })
})