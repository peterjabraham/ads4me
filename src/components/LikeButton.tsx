import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { saveLikedHeadline, removeLikedHeadline, getLikedHeadlines } from '@/app/utils/likedHeadlines';

interface LikeButtonProps {
  headline: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ headline }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      const likedHeadlines = await getLikedHeadlines();
      setIsLiked(likedHeadlines.includes(headline));
    };
    checkIfLiked();
  }, [headline]);

  const handleLike = async () => {
    if (isLiked) {
      await removeLikedHeadline(headline);
    } else {
      await saveLikedHeadline(headline);
    }
    setIsLiked(!isLiked);
  };

  return (
    <button onClick={handleLike} className="focus:outline-none">
      {isLiked ? (
        <FaHeart className="text-red-500 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-500 text-xl" />
      )}
    </button>
  );
};

export default LikeButton;
