import { useEffect } from "react";
import { useParams } from "wouter";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { usePantryDetails } from "@/hooks/usePantries";
import PantryDetail from "@/components/PantryDetail";

export default function PantryDetails() {
  const { id } = useParams();
  const { pantry, foodItems, reviews, isLoading, error } = usePantryDetails(id);

  // Set page title
  useEffect(() => {
    if (pantry) {
      document.title = `${pantry.name} - FoodShare`;
    } else {
      document.title = "Food Pantry Details - FoodShare";
    }
    
    return () => {
      document.title = "FoodShare - Find Free Food Near You";
    };
  }, [pantry]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-red-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Pantry</h3>
            <p className="text-red-700 mb-4">
              We couldn't load the details for this food pantry. It may have been removed or is temporarily unavailable.
            </p>
          </div>
        </div>
      ) : pantry ? (
        <PantryDetail
          pantry={pantry}
          foodItems={foodItems}
          reviews={reviews}
          visible={true}
          onClose={() => window.history.back()}
        />
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">Pantry Not Found</h3>
            <p className="text-gray-500 mb-4">
              The food pantry you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
}
