import { LikedHeadlinesList } from '@/components/LikedHeadlinesList';

export default function LikedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Liked Headlines</h1>
      <LikedHeadlinesList />
    </div>
  );
}