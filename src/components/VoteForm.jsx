import { Button } from '@wordpress/components'
import '../styles/poll.css'

function VoteForm({ userVote, onSubmit, isLoading }) {
  const getButtonVariant = (status) => {
    return userVote === status ? 'primary' : 'secondary'
  }

  return (
    <div className="cricpoll-vote-form">
      <h3>Your Availability</h3>
      <p>Select your availability for this week's match:</p>
      
      <div className="cricpoll-vote-options">
        <Button 
          isLarge 
          variant={getButtonVariant('available')}
          onClick={() => onSubmit('available')}
          disabled={isLoading}
        >
          Available
        </Button>
        
        <Button 
          isLarge 
          variant={getButtonVariant('unavailable')}
          onClick={() => onSubmit('unavailable')}
          disabled={isLoading}
        >
          Unavailable
        </Button>
      </div>
      
      {userVote && (
        <p className="cricpoll-current-vote">
          Your current selection: <strong>{userVote}</strong>
        </p>
      )}
    </div>
  )
}

export default VoteForm
