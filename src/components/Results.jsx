import { format } from 'date-fns'
import '../styles/results.css'

function Results({ data, currentUserId }) {
  if (!data) return null

  const renderVoteList = (votes, title, isAvailable = false) => {
    if (votes.length === 0) return null

    return (
      <div className={`cricpoll-vote-list ${isAvailable ? 'available' : ''}`}>
        <h4>{title} ({votes.length})</h4>
        <ul>
          {votes.map((vote, index) => (
            <li 
              key={vote.vote_id} 
              className={vote.user_id === currentUserId ? 'current-user' : ''}
            >
              <span className="vote-position">{index + 1}.</span>
              <span className="vote-name">{vote.user_name}</span>
              <span className="vote-time">
                {format(new Date(vote.vote_time), 'MMM dd, h:mm a')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="cricpoll-results">
      <h3>Current Poll Status</h3>
      
      <div className="cricpoll-results-grid">
        {renderVoteList(data.available, 'Available Players', true)}
        {renderVoteList(data.waiting, 'Waiting List')}
        {renderVoteList(data.unavailable, 'Not Available')}
      </div>
      
      <div className="cricpoll-results-legend">
        <p><span className="current-user-marker"></span> Your vote</p>
      </div>
    </div>
  )
}

export default Results
