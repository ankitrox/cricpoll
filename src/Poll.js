import React, { useEffect, useState } from 'react';
import { fetchActivePoll, fetchVotes, submitVote } from './api';

const Poll = () => {
    const [poll, setPoll] = useState(null);
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadPoll() {
            try {
                const active = await fetchActivePoll();
                setPoll(active);
                const voteData = await fetchVotes(active.id);
                setVotes(voteData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadPoll();
    }, []);

    const handleVote = async (option) => {
        if (!poll) return;
        const result = await submitVote(poll.id, option);
        setVotes(result.votes);
    };

    const formatDate = (ts) => {
        return new Date(ts * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    };

    const sortedVotes = [...votes].sort((a, b) => a.time - b.time);
    const available = sortedVotes.filter(v => v.vote === 'available');
    const waiting = sortedVotes.filter(v => v.vote === 'waiting');
    const unavailable = sortedVotes.filter(v => v.vote === 'unavailable');

    if (loading) return <p>Loading poll...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow-md">
            <h1 className="text-xl font-bold mb-4">{poll.title}</h1>

            <div className="space-x-2 mb-6">
                <button onClick={() => handleVote('available')} className="bg-green-500 text-white px-4 py-2 rounded">
                    Available
                </button>
                <button onClick={() => handleVote('unavailable')} className="bg-red-500 text-white px-4 py-2 rounded">
                    Unavailable
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h2 className="font-semibold text-lg mb-2">Available ({available.length}/16)</h2>
                    <ul className="list-disc pl-4">
                        {available.map(v => (
                            <li key={v.user_id}>{v.user_id} - {formatDate(v.time)}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-2">Waiting List ({waiting.length})</h2>
                    <ul className="list-disc pl-4">
                        {waiting.map(v => (
                            <li key={v.user_id}>{v.user_id} - {formatDate(v.time)}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="font-semibold text-lg mb-2">Unavailable</h2>
                <ul className="list-disc pl-4">
                    {unavailable.map(v => (
                        <li key={v.user_id}>{v.user_id} - {formatDate(v.time)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Poll;
