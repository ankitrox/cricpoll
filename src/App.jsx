import { useState, useEffect } from 'react'
import { Spinner } from '@wordpress/components'
import Auth from './components/Auth'
import Poll from './components/Poll'
import apiFetch from '@wordpress/api-fetch'
import './styles/global.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pollData, setPollData] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('cricpoll_jwt')
    if (token) verifyToken(token)
    else setIsLoading(false)
    
    fetchActivePoll()
  }, [])

  const verifyToken = async (token) => {
    try {
      apiFetch.setFetchHandler(async (options) => {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }

        const response = await fetch(options.url, {
          method: options.method,
          headers,
          body: options.data ? JSON.stringify(options.data) : null
        })

        if (!response.ok) throw new Error('Invalid token')
        return response.json()
      })

      const user = await apiFetch({
        url: `${window.cricpoll.apiBase}/wp/v2/users/me`,
        method: 'GET'
      })

      setIsAuthenticated(true)
      setUserData(user)
    } catch (error) {
      localStorage.removeItem('cricpoll_jwt')
      console.error('Token verification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActivePoll = async () => {
    try {
      const response = await apiFetch({
        url: `${window.cricpoll.apiBase}/wp-json/cricpoll/v1/poll`,
        method: 'GET'
      })
      setPollData(response)
    } catch (error) {
      console.error('Failed to fetch poll:', error)
      setPollData(null)
    }
  }

  const handleLogin = (token) => {
    localStorage.setItem('cricpoll_jwt', token)
    verifyToken(token)
  }

  const handleLogout = () => {
    localStorage.removeItem('cricpoll_jwt')
    setIsAuthenticated(false)
    setUserData(null)
  }

  if (isLoading) {
    return (
      <div className="cricpoll-loading">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="cricpoll-app">
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Poll 
          pollData={pollData} 
          userData={userData} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  )
}

export default App
