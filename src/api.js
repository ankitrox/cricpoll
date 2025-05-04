const API_BASE = 'https://api.ankitgade.in/wp-json/cricpoll/v1';

export async function fetchActivePoll() {
    const res = await fetch(`${API_BASE}/poll/active`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('No active poll');
    return res.json();
}

export async function fetchVotes(pollId) {
    const res = await fetch(`${API_BASE}/poll/votes?poll_id=${pollId}`, {
        credentials: 'include'
    });
    return res.json();
}

export async function submitVote(pollId, vote) {
    const res = await fetch(`${API_BASE}/poll/vote`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ poll_id: pollId, vote })
    });
    return res.json();
}
