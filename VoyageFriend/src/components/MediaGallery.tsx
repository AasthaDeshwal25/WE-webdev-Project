import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image, Video } from 'lucide-react';
import { cn } from '../lib/utils';

interface Media {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface MediaGalleryProps {
  media: Media[];
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media.length) return null;

  const handlePrevious = () => {
    setCurrentIndex((current) => (current === 0 ? media.length - 1 : current - 1));
  };

  const handleNext = () => {
    setCurrentIndex((current) => (current === media.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative w-full h-48">
      {media[currentIndex].type === 'image' ? (
        <img
          src={media[currentIndex].url}
          alt="Poll media"
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={media[currentIndex].url}
          controls
          className="w-full h-full object-cover"
        />
      )}

      {media.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  currentIndex === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}