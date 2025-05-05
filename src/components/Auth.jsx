import { useState } from 'react'
import { TextControl, Button, Spinner } from '@wordpress/components'
import '../styles/auth.css'

function Auth({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${window.cricpoll.apiBase}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      if (data.token) onLogin(data.token)
      else setError(data.message || 'Login failed')
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="cricpoll-auth">
      <h2>Cricket Availability Poll</h2>
      <p>Please login to participate in the poll</p>
      
      <form onSubmit={handleSubmit}>
        <TextControl
          label="Username"
          value={username}
          onChange={setUsername}
          required
        />
        
        <TextControl
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        
        {error && <div className="cricpoll-error">{error}</div>}
        
        <Button 
          type="submit" 
          isPrimary 
          disabled={isLoading}
        >
          {isLoading ? <><Spinner /> Logging in...</> : 'Login'}
        </Button>
      </form>
    </div>
  )
}

export default Auth
