import { Star, MapPin } from 'lucide-react';

interface PlaceCardProps {
  name: string;
  image: string;
  rating: number;
  priceLevel: number;
  address: string;
  onClick: () => void;
}

export function PlaceCard({ name, image, rating, priceLevel, address, onClick }: PlaceCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="text-gray-700">{rating.toFixed(1)}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-700">
            {Array(priceLevel).fill('₹').join('')}
          </span>
        </div>
        
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
          <p>{address}</p>
        </div>
      </div>
    </div>
  );
}