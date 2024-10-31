'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { saveLikedHeadline, removeLikedHeadline, getLikedHeadlines } from '@/utils/likedHeadlines';
import { useToast } from '@/components/ui/use-toast';

interface LikeButtonProps {
  headline: string;
}

export function LikeButton({ headline }: LikeButtonProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!session?.user?.id) return;

      try {
        const likedHeadlines = await getLikedHeadlines(session.user.id);
        setIsLiked(likedHeadlines.some(h => h.headline === headline));
      } catch (error) {
        console.error('Error checking liked status:', error);
        toast({
          title: 'Error',
          description: 'Failed to check liked status',
          variant: 'destructive',
        });
      }
    };

    checkIfLiked();
  }, [headline, session?.user?.id]);

  const handleLike = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like headlines',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        await removeLikedHeadline(headline, session.user.id);
        toast({
          title: 'Removed',
          description: 'Headline removed from favorites',
        });
      } else {
        await saveLikedHeadline(headline, session.user.id);
        toast({
          title: 'Saved',
          description: 'Headline added to favorites',
        });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update headline status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLike} 
      className="focus:outline-none disabled:opacity-50"
      disabled={isLoading}
    >
      {isLiked ? (
        <FaHeart className="text-red-500 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-500 text-xl hover:text-red-500 transition-colors" />
      )}
    </button>
  );
}

export default LikeButton;