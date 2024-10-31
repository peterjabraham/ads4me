'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  getLikedHeadlines, 
  saveLikedHeadline, 
  removeLikedHeadline,
  type LikedHeadline 
} from '@/utils/localStorageHeadlines';

export function useLikedHeadlines() {
  const { data: session } = useSession();
  const [headlines, setHeadlines] = useState<LikedHeadline[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      const likedHeadlines = getLikedHeadlines(session.user.id);
      setHeadlines(likedHeadlines);
    }
  }, [session?.user?.id]);

  const addHeadline = (headline: string) => {
    if (session?.user?.id) {
      saveLikedHeadline(headline, session.user.id);
      setHeadlines(getLikedHeadlines(session.user.id));
    }
  };

  const removeHeadline = (headlineId: string) => {
    if (session?.user?.id) {
      removeLikedHeadline(headlineId, session.user.id);
      setHeadlines(getLikedHeadlines(session.user.id));
    }
  };

  const isHeadlineLiked = (headline: string) => {
    return headlines.some(h => h.text === headline);
  };

  return {
    headlines,
    addHeadline,
    removeHeadline,
    isHeadlineLiked,
  };
}