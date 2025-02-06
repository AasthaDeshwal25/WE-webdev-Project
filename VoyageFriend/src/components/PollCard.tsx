import React, { useState, useCallback, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MoreVertical, Trash2, Share2, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { MediaGallery } from './MediaGallery';

interface Media {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface PollCardProps {
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
  onVote: (type: 'up' | 'down') => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  userVote?: 'up' | 'down';
}

export function PollCard({
  id,
  title,
  description,
  budget,
  media,
  votes,
  onVote,
  onDelete,
  onShare,
  userVote
}: PollCardProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const totalVotes = votes.up + votes.down;
  const upPercentage = totalVotes > 0 ? (votes.up / totalVotes) * 100 : 0;

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      onDelete(id);
    }
    setShowContextMenu(false);
  }, [id, onDelete]);

  const handleShare = useCallback(() => {
    onShare(id);
    setShowContextMenu(false);
  }, [id, onShare]);

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div onContextMenu={handleContextMenu} className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      <MediaGallery media={media} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowContextMenu(!showContextMenu);
              setContextMenuPosition({
                x: e.currentTarget.getBoundingClientRect().right,
                y: e.currentTarget.getBoundingClientRect().bottom
              });
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center gap-2 mb-4 text-gray-700 bg-gray-50 p-3 rounded-lg">
          <DollarSign className="w-5 h-5" />
          <span className="font-medium">
            {budget.amount.toLocaleString(undefined, { style: 'currency', currency: budget.currency })}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => onVote('up')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              userVote === 'up' ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            )}
          >
            <ThumbsUp className="w-5 h-5" />
            <span>{votes.up}</span>
          </button>
          <button
            onClick={() => onVote('down')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              userVote === 'down' ? "bg-red-100 text-red-700" : "hover:bg-gray-100"
            )}
          >
            <ThumbsDown className="w-5 h-5" />
            <span>{votes.down}</span>
          </button>
        </div>
        {totalVotes > 0 && (
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${upPercentage}%` }} />
          </div>
        )}
        <div className="mt-2 text-sm text-gray-500 text-center">Total votes: {totalVotes}</div>
      </div>
      {showContextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg py-1 z-50"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x, transform: 'translate(-100%, 0)' }}
        >
          <button onClick={handleShare} className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Poll
          </button>
          <button onClick={handleDelete} className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Poll
          </button>
        </div>
      )}
    </div>
  );
}
