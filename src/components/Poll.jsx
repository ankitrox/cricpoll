import { useState, useEffect } from 'react'
import { Button, Spinner, Notice } from '@wordpress/components'
import apiFetch from '@wordpress/api-fetch'
import { format } from 'date-fns'
import Results from './Results'
import VoteForm from './VoteForm'
import '../styles/poll.css'

function Poll({ pollData, userData, onLogout }) {
  const [poll, setPoll] = useState(pollData)
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userVote, setUserVote] = useState(null)

  useEffect(() => {
    if (pollData) {
      setPoll(pollData)
      fetchResults(pollData.id)
    }
  }, [pollData])

  const fetchResults = async (pollId) => {
    setIsLoading(true)
    try {
      const response = await apiFetch({
        url: `${window.cricpoll.apiBase}/wp-json/cricpoll/v1/results?poll_id=${pollId}`,
        method: 'GET'
      })
      setResults(response)
      
      const allVotes = [...response.available, ...response.waiting, ...response.unavailable]
      const vote = allVotes.find(v => v.user_id === userData.id)
      setUserVote(vote ? vote.status : null)
    } catch (err) {
      setError('Failed to fetch poll results')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoteSubmit = async (status) => {
    setIsLoading(true)
    try {
      await apiFetch({
        url: `${window.cricpoll.apiBase}/wp-json/cricpoll/v1/vote`,
        method: 'POST',
        data: { poll_id: poll.id, status }
      })
      await fetchResults(poll.id)
    } catch (err) {
      setError('Failed to submit vote')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="cricpoll-container">
      <header className="cricpoll-header">
        <h1>{poll ? poll.title : 'Cricket Availability Poll'}</h1>
        <Button isSecondary onClick={onLogout}>Logout</Button>
      </header>
      
      {error && (
        <Notice status="error" onRemove={() => setError(null)}>
          {error}
        </Notice>
      )}
      
      {isLoading && <Spinner />}
      
      {poll ? (
        <>
          <div className="cricpoll-meta">
            <p>
              <strong>Status:</strong> {poll.status}
              <br />
              <strong>Created:</strong> {format(new Date(poll.created_date), 'PPpp')}
            </p>
          </div>
          
          <VoteForm 
            userVote={userVote} 
            onSubmit={handleVoteSubmit} 
            isLoading={isLoading}
          />
          
          <Results 
            data={results} 
            currentUserId={userData.id}
          />
        </>
      ) : (
        <div className="cricpoll-no-poll">
          <p>There is no active poll at the moment.</p>
          <p>Polls are automatically created every Wednesday at 7:00 AM IST.</p>
        </div>
      )}
    </div>
  )
}

export default Poll
