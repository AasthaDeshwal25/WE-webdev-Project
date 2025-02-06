import React, { useState } from 'react';
import { PlaceCard } from './components/PlaceCard';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  image: string;
  rating: number;
  priceLevel: number;
  address: string;
  types: string[];
  userRatingsTotal: number;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'Rs', symbol:  '₹' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
];

export function RecommendationsPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    type: 'restaurant',
    priceLevel: 0,
    rating: 0,
    maxBudget: {
      amount: 0,
      currency: 'USD'
    },
    cuisine: '',
    preferences: [] as string[]
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const searchPlaces = async () => {
    if (!location) {
      setError('Please enter a location to search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll use some sample data
      // In a real application, you would make API calls to a backend service
      // that would handle the Google Places API requests
      const samplePlaces: Place[] = [
        {
          id: '1',
          name: 'Le Petit Bistro',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          rating: 4.5,
          priceLevel: 3,
          address: '123 Sample Street, Paris',
          types: ['restaurant', 'food'],
          userRatingsTotal: 856
        },
        {
          id: '2',
          name: 'Café de Paris',
          image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
          rating: 4.2,
          priceLevel: 2,
          address: '456 Example Avenue, Paris',
          types: ['cafe', 'restaurant'],
          userRatingsTotal: 1243
        },
        {
          id: '3',
          name: 'The Grand Hotel',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          rating: 4.8,
          priceLevel: 4,
          address: '789 Test Boulevard, Paris',
          types: ['lodging', 'hotel'],
          userRatingsTotal: 2156
        }
      ];

      // Apply recommendation algorithm
      const recommendedPlaces = samplePlaces
        .map(place => ({
          ...place,
          score: calculateRecommendationScore(place, filters)
        }))
        .sort((a, b) => b.score - a.score)
        .map(({ score, ...place }) => place);

      setPlaces(recommendedPlaces);
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch places');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateRecommendationScore = (place: Place, filters: typeof filters) => {
    let score = 0;

    // Rating score (0-5 points)
    score += place.rating;

    // Price level match (0-3 points)
    if (filters.priceLevel > 0 && place.priceLevel === filters.priceLevel) {
      score += 3;
    }

    // Popular place bonus (0-2 points)
    if (place.userRatingsTotal > 1000) score += 2;
    else if (place.userRatingsTotal > 500) score += 1;

    // Preference matching (0-3 points per match)
    filters.preferences.forEach(pref => {
      if (place.types.some(type => type.includes(pref.toLowerCase()))) {
        score += 3;
      }
    });

    return score;
  };

  const filteredPlaces = places.filter(place => {
    if (searchQuery && !place.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.priceLevel > 0 && place.priceLevel !== filters.priceLevel) {
      return false;
    }
    if (filters.rating > 0 && place.rating < filters.rating) {
      return false;
    }
    if (filters.maxBudget.amount > 0) {
      const estimatedBudget = place.priceLevel * 25; // Rough estimation
      if (estimatedBudget > filters.maxBudget.amount) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Recommendations
          </h1>
          <p className="text-xl text-gray-600">
            Discover the best places to eat and stay
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter location (e.g., Paris, France)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={searchPlaces}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Filter results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
            >
              <option value="restaurant">Restaurants</option>
              <option value="hotel">Hotels</option>
              <option value="tourist_attraction">Attractions</option>
            </select>

            <select
              value={filters.priceLevel}
              onChange={(e) => setFilters(f => ({ ...f, priceLevel: Number(e.target.value) }))}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
            >
              <option value="0">Any Price</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
            </select>

            <select
              value={filters.rating}
              onChange={(e) => setFilters(f => ({ ...f, rating: Number(e.target.value) }))}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
            >
              <option value="0">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>

            <div className="flex gap-2 items-center">
              <select
                value={filters.maxBudget.currency}
                onChange={(e) => setFilters(f => ({
                  ...f,
                   maxBudget: { ...f.maxBudget, currency: e.target.value }
                }))}
                className="px-3 py-2 border border-gray-300 rounded-lg"
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
                step="1"
                placeholder="Max budget"
                value={filters.maxBudget.amount || ''}
                onChange={(e) => setFilters(f => ({
                  ...f,
                  maxBudget: { ...f.maxBudget, amount: Number(e.target.value) }
                }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Add preferences (e.g., outdoor, family-friendly)"
              value={filters.cuisine}
              onChange={(e) => setFilters(f => ({ ...f, cuisine: e.target.value }))}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => {
                if (filters.cuisine && !filters.preferences.includes(filters.cuisine)) {
                  setFilters(f => ({
                    ...f,
                    preferences: [...f.preferences, f.cuisine],
                    cuisine: ''
                  }));
                }
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add Preference
            </button>
          </div>

          {filters.preferences.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {filters.preferences.map((pref, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                >
                  {pref}
                  <button
                    onClick={() => setFilters(f => ({
                      ...f,
                      preferences: f.preferences.filter((_, i) => i !== index)
                    }))}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recommendations...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 whitespace-pre-line">{error}</p>
          </div>
        )}

        {!loading && !error && filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No places found matching your criteria.</p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlaces.map(place => (
            <PlaceCard
              key={place.id}
              {...place}
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`, '_blank');
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}