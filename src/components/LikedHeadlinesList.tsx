'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getLikedHeadlines, type LikedHeadline } from '@/utils/localStorageHeadlines';
import { LikeButton } from './LikeButton';

export function LikedHeadlinesList() {
  const { data: session } = useSession();
  const [headlines, setHeadlines] = useState<LikedHeadline[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      const likedHeadlines = getLikedHeadlines(session.user.id);
      setHeadlines(likedHeadlines);
    }
  }, [session?.user?.id]);

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view your liked headlines</p>
      </div>
    );
  }

  if (headlines.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No liked headlines yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {headlines.map((headline) => (
        <div 
          key={headline.id} 
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <p className="flex-1 mr-4">{headline.text}</p>
          <LikeButton headline={headline.text} />
        </div>
      ))}
    </div>
  );
}