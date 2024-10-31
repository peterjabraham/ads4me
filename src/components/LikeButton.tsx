'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { 
  saveLikedHeadline, 
  removeLikedHeadline, 
  getLikedHeadlines 
} from '@/utils/localStorageHeadlines';
import { useToast } from '@/components/ui/use-toast';

interface LikeButtonProps {
  headline: string;
}

export function LikeButton({ headline }: LikeButtonProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.id) {
      const headlines = getLikedHeadlines(session.user.id);
      setIsLiked(headlines.some(h => h.text === headline));
    }
  }, [headline, session?.user?.id]);

  const handleLike = () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like headlines",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        const headlines = getLikedHeadlines(session.user.id);
        const headlineToRemove = headlines.find(h => h.text === headline);
        if (headlineToRemove) {
          removeLikedHeadline(headlineToRemove.id, session.user.id);
        }
        setIsLiked(false);
        toast({
          title: "Removed from likes",
          description: "Headline removed from your liked collection",
        });
      } else {
        saveLikedHeadline(headline, session.user.id);
        setIsLiked(true);
        toast({
          title: "Added to likes",
          description: "Headline saved to your liked collection",
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "There was an error processing your request",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleLike}
      className="transition-colors duration-200 hover:text-red-500"
      aria-label={isLiked ? "Unlike headline" : "Like headline"}
    >
      {isLiked ? (
        <FaHeart className="w-5 h-5 text-red-500" />
      ) : (
        <FaRegHeart className="w-5 h-5" />
      )}
    </button>
  );
}