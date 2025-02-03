import React, { useState, useCallback } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { PlaceCard } from '../components/PlaceCard';
import { Search, MapPin } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  image: string;
  rating: number;
  priceLevel: number;
  address: string;
  types: string[];
  userRatingsTotal: number;
  location: {
    lat: number;
    lng: number;
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

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

export function RecommendationsPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 48.8566, lng: 2.3522 }); // Paris by default
  
  const [filters, setFilters] = useState({
    type: 'restaurant',
    priceLevel: 0,
    rating: 0,
    maxBudget: {
      amount: 0,
      currency: 'INR'
    },
    cuisine: '',
    preferences: [] as string[]
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const searchPlaces = useCallback(async () => {
    if (!isLoaded || !location) {
      setError('Please enter a location to search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, geocode the location
      const geocoder = new google.maps.Geocoder();
      const geocodeResult = await geocoder.geocode({ address: location });
      
      if (!geocodeResult.results.length) {
        throw new Error('Location not found');
      }

      const locationLatLng = geocodeResult.results[0].geometry.location;
      setMapCenter({ lat: locationLatLng.lat(), lng: locationLatLng.lng() });

      // Create Places Service
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      // Search for places
      const searchRequest = {
        location: locationLatLng,
        radius: 5000,
        type: filters.type as google.maps.places.PlaceType,
        keyword: filters.cuisine || searchQuery
      };

      const placesResult = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
        service.nearbySearch(searchRequest, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error('Failed to find places'));
          }
        });
      });

      // Get details for each place
      const detailedPlaces = await Promise.all(
        placesResult.slice(0, 10).map(async place => {
          const details = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
            service.getDetails(
              {
                placeId: place.place_id!,
                fields: ['photos', 'price_level', 'rating', 'user_ratings_total', 'formatted_address', 'types', 'geometry']
              },
              (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                  resolve(result);
                } else {
                  reject(new Error('Failed to get place details'));
                }
              }
            );
          });

          return {
            id: place.place_id!,
            name: place.name!,
            image: place.photos?.[0].getUrl({ maxWidth: 800, maxHeight: 600 }) || 
                  'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800',
            rating: details.rating || 0,
            priceLevel: details.price_level || 0,
            address: details.formatted_address!,
            types: details.types || [],
            userRatingsTotal: details.user_ratings_total || 0,
            location: {
              lat: details.geometry?.location?.lat() || 0,
              lng: details.geometry?.location?.lng() || 0
            }
          };
        })
      );

      // Apply recommendation algorithm
      const recommendedPlaces = detailedPlaces
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
  }, [isLoaded, location, filters, searchQuery]);

  const calculateRecommendationScore = (place: Place, filters: typeof filters) =>{
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
      const estimatedBudget = place.priceLevel * 25;
      if (estimatedBudget > filters.maxBudget.amount) {
        return false;
      }
    }
    return true;
  });

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading Google Maps</p>
          <p className="text-gray-600">Please check your API key and try again</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location (e.g., Paris, France)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={searchPlaces}
              disabled={loading || !location}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
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
              <option value="1">₹</option>
              <option value="2">$</option>
              <option value="3">₹</option>
              <option value="4">$</option>
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
                    
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 whitespace-pre-line">{error}</p>
          </div>
        )}

        {!loading && !error && filteredPlaces.length === 0 && places.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No places found matching your criteria.</p>
          </div>
        )}

        {places.length > 0 && (
          <div className="mb-8">
            <div className="h-[300px] rounded-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={13}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  streetViewControl: true,
                  mapTypeControl: true,
                }}
              >
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </GoogleMap>
            </div>
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
