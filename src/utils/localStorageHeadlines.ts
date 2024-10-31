// Local storage keys
const LIKED_HEADLINES_KEY = 'likedHeadlines';

export interface LikedHeadline {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
}

export const saveLikedHeadline = (headline: string, userId: string): void => {
  try {
    const headlines = getLikedHeadlines(userId);
    const newHeadline: LikedHeadline = {
      id: Date.now().toString(),
      text: headline,
      userId,
      timestamp: Date.now(),
    };
    headlines.push(newHeadline);
    localStorage.setItem(LIKED_HEADLINES_KEY, JSON.stringify(headlines));
  } catch (error) {
    console.error('Error saving headline:', error);
  }
};

export const removeLikedHeadline = (headlineId: string, userId: string): void => {
  try {
    const headlines = getLikedHeadlines(userId);
    const filteredHeadlines = headlines.filter(h => h.id !== headlineId);
    localStorage.setItem(LIKED_HEADLINES_KEY, JSON.stringify(filteredHeadlines));
  } catch (error) {
    console.error('Error removing headline:', error);
  }
};

export const getLikedHeadlines = (userId: string): LikedHeadline[] => {
  try {
    const headlines = localStorage.getItem(LIKED_HEADLINES_KEY);
    if (!headlines) return [];
    const parsedHeadlines: LikedHeadline[] = JSON.parse(headlines);
    return parsedHeadlines.filter(h => h.userId === userId);
  } catch (error) {
    console.error('Error getting headlines:', error);
    return [];
  }
};