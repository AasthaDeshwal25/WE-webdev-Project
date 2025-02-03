import React, { useState } from 'react';
import { PollCard } from '../components/PollCard';
import { Plus, X, Image, Video, Trash2} from 'lucide-react';

interface Media {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  budget: {
    amount: number;
    currency: string;
  };
  media: Media[];
  votes: {
    up: number;
    down: number;
  };
}

const CURRENCIES = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
];

const INITIAL_POLLS: Poll[] = [
  {
    id: '1',
    title: 'Visit Eiffel Tower',
    description: 'Should we include the iconic Eiffel Tower in our Paris itinerary?',
    budget: {
      amount: 2500,
      currency: 'INR'
    },
    media: [{
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800'
    }],
    votes: { up: 12, down: 3 }
  },
  {
    id: '2',
    title: 'Beach Day in Nice',
    description: 'Take a relaxing day at the beautiful beaches of Nice?',
    budget: {
      amount: 50,
      currency: 'EUR'
    },
    media: [{
      type: 'image',
      url: 'https://images.unsplash.com/photo-1533588435723-1e600978d256?auto=format&fit=crop&q=80&w=800'
    }],
    votes: { up: 8, down: 5 }
  },
  {
    id: '3',
    title: 'Wine Tasting in Bordeaux',
    description: 'Experience the famous wine region with a guided tour?',
    budget: {
      amount: 120,
      currency: 'INR'
    },
    media: [{
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800'
    }],
    votes: { up: 15, down: 2 }
  }
];

export function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    budget: {
      amount: 0,
      currency: 'INR'
    },
    media: [] as Media[]
  });

  const handleVote = (pollId: string, voteType: 'up' | 'down') => {
    setPolls(currentPolls => 
      currentPolls.map(poll => {
        if (poll.id === pollId) {
          const previousVote = userVotes[pollId];
          const votes = { ...poll.votes };

          if (previousVote) {
            votes[previousVote]--;
          }
          votes[voteType]++;

          return { ...poll, votes };
        }
        return poll;
      })
    );
    setUserVotes(current => ({ ...current, [pollId]: voteType }));
  };

  const handleDeletePoll = (pollId: string) => {
    setPolls(currentPolls => currentPolls.filter(poll => poll.id !== pollId));
    setUserVotes(current => {
      const newVotes = { ...current };
      delete newVotes[pollId];
      return newVotes;
    });
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const newPollItem: Poll = {
      id: Date.now().toString(),
      title: newPoll.title,
      description: newPoll.description,
      budget: newPoll.budget,
      media: newPoll.media,
      votes: { up: 0, down: 0 }
    };
    setPolls(current => [...current, newPollItem]);
    setNewPoll({
      title: '',
      description: '',
      budget: { amount: 0, currency: 'INR' },
      media: []
    });
    setShowCreateModal(false);
  };

  const handleAddMedia = (type: 'image' | 'video') => {
    const url = prompt(`Enter ₹{type} URL:`);
    if (url) {
      setNewPoll(current => ({
        ...current,
        media: [...current.media, { type, url }]
      }));
    }
  };

  const handleRemoveMedia = (index: number) => {
    setNewPoll(current => ({
      ...current,
      media: current.media.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Group Polls
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Vote on activities and destinations for our upcoming trip!
          </p>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Poll
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {polls.map(poll => (
            <PollCard
              key={poll.id}
              {...poll}
              userVote={userVotes[poll.id]}
              onVote={(type) => handleVote(poll.id, type)}
              onDelete={handleDeletePoll}
            />
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Poll</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newPoll.title}
                    onChange={(e) => setNewPoll(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Visit the Louvre Museum"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={newPoll.description}
                    onChange={(e) => setNewPoll(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the activity or destination..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Budget
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={newPoll.budget.currency}
                      onChange={(e) => setNewPoll(p => ({
                        ...p,
                        budget: { ...p.budget, currency: e.target.value }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {CURRENCIES.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={newPoll.budget.amount}
                      onChange={(e) => setNewPoll(p => ({
                        ...p,
                        budget: { ...p.budget, amount: parseFloat(e.target.value) }
                      }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handleAddMedia('image')}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Image className="w-5 h-5" />
                      Add Image
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddMedia('video')}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      Add Video
                    </button>
                  </div>

                  {newPoll.media.length > 0 && (
                    <div className="space-y-2">
                      {newPoll.media.map((media, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            {media.type === 'image' ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                            <span className="text-sm truncate max-w-[200px]">{media.url}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
