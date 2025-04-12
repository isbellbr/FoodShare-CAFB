import { useLocation } from "wouter";
import { Pantry } from "@/types";
import { 
  calculateWalkingTime, 
  formatOpeningHours, 
  getPantryStatus 
} from "@/lib/utils";

interface PantryCardProps {
  pantry: Pantry;
  onReserve: (pantryId: string) => void;
  onContact: (pantryId: string) => void;
}

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default function PantryCard({ pantry, onReserve, onContact }: PantryCardProps) {
  const [, navigate] = useLocation();
  
  const { status, statusText } = getPantryStatus(pantry.openingHours);
  
  const handleCardClick = () => {
    navigate(`/pantry/${pantry.id}`);
  };
  
  const handleReserve = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReserve(pantry.id);
  };
  
  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContact(pantry.id);
  };
  
  // Get food categories from pantry
  const getFoodCategories = () => {
    // In a real app, this would come from the pantry's food items
    // For this demo, we'll use hardcoded values
    const categoryMap: Record<string, string[]> = {
      "St. Mary's Food Bank": ["Produce", "Dairy", "Canned"],
      "Community Hope Center": ["Hot Meals", "Vegetarian", "Delivery"],
      "Neighborhood Relief Kitchen": ["Produce", "Meat", "Gluten-Free"]
    };
    
    return categoryMap[pantry.name] || ["Produce", "Canned"];
  };
  
  return (
    <div className="pantry-card bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-neutral-200" onClick={handleCardClick}>
      <div className="flex md:flex-row flex-col">
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
          <img
            src={pantry.imageUrl || "https://images.unsplash.com/photo-1593113598332-cd59a93e6f91"}
            alt={`${pantry.name} food pantry`}
            className="w-full h-full object-cover max-h-60 rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
          />
        </div>
        <div className="p-4 md:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-heading font-semibold text-neutral-dark">{pantry.name}</h3>
              <span className={`status-badge status-${status}`}>{statusText}</span>
            </div>
            <div className="flex items-center mt-1 text-neutral-gray text-sm">
              <div className="flex items-center">
                <ClockIcon />
                <span>{formatOpeningHours(pantry.openingHours)}</span>
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <LocationIcon />
                <span>
                  {pantry.distance?.toFixed(1) || pantry.walkingDistance?.toFixed(1) || "?"} miles 
                  ({calculateWalkingTime(pantry.distance || pantry.walkingDistance || 1)})
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex space-x-1 mb-2 flex-wrap gap-y-1">
                {getFoodCategories().map((category, i) => (
                  <span key={i} className="px-3 py-1 bg-neutral-light text-xs rounded-full text-neutral-dark border border-neutral-300">
                    {category}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${star > 4 ? "opacity-30" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-neutral-dark font-medium">4.2</span>
                  <span className="ml-1 text-neutral-gray">(46)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3 mt-3">
            <button
              className="flex-1 bg-primary text-white py-2 rounded-md font-medium"
              onClick={handleReserve}
            >
              Reserve
            </button>
            <button
              className="flex-1 bg-neutral-light text-neutral-dark py-2 rounded-md font-medium"
              onClick={handleContact}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
