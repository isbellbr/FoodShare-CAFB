import { Review } from "@/types";
import { formatTimeAgo, getInitials } from "@/lib/utils";

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  // Determine the background color based on the user's name or ID
  const getColorClass = (id: string) => {
    const colors = [
      "bg-primary",
      "bg-secondary",
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    
    // Simple hash function to get a consistent color for each user
    const hash = Array.from(id)
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return colors[hash % colors.length];
  };
  
  const userInitials = getInitials(review.user?.displayName || "User");
  const colorClass = getColorClass(review.userId);
  
  return (
    <div className="border-b pb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {review.user?.profileImage ? (
            <img
              src={review.user.profileImage}
              alt={review.user.displayName || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={`w-10 h-10 ${colorClass} text-white rounded-full flex items-center justify-center font-medium`}>
              {userInitials}
            </div>
          )}
          <div className="ml-3">
            <p className="font-medium">{review.user?.displayName || "Anonymous User"}</p>
            <p className="text-xs text-neutral-gray">{formatTimeAgo(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center text-yellow-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${star > review.rating ? "opacity-30" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-sm">{review.comment || "No comment provided."}</p>
    </div>
  );
}
