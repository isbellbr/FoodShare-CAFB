import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import LocationBar from "@/components/LocationBar";
import PantryCard from "@/components/PantryCard";
import BottomNavigation from "@/components/BottomNavigation";
import PantryDetail from "@/components/PantryDetail";
import { useAuth } from "@/hooks/useAuth";
import { usePantryDetails } from "@/hooks/usePantries";
import { useToast } from "@/hooks/use-toast";
import { getUserFavorites } from "@/lib/firebase";
import { Pantry } from "@/types";
import { useReservations } from "@/hooks/useReservations";

export default function Saved() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Pantry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPantryId, setSelectedPantryId] = useState<string | null>(null);
  const [contactPantryId, setContactPantryId] = useState<string | null>(null);
  const { createReservation } = useReservations();
  
  const { pantry, foodItems, reviews } = usePantryDetails(selectedPantryId || undefined);
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const favoritesData = await getUserFavorites(user.uid);
        
        // In a real app, we would fetch the full pantry details for each favorite
        // For this demo, we'll use the sample pantries from the storage
        
        // Mocked favorites for demonstration - in real app, this would come from Firebase
        const mockFavorites = [
          {
            id: "1",
            name: "St. Mary's Food Bank",
            description: "Community food bank offering fresh produce, dairy, and canned goods.",
            address: "2831 N 31st Ave, Phoenix, AZ 85009",
            latitude: 37.774,
            longitude: -122.419,
            contactPhone: "(602) 555-1234",
            contactEmail: "info@stmarysfoodbank.org",
            imageUrl: "https://images.unsplash.com/photo-1593113598332-cd59a93e6f91",
            adminId: 1,
            walkingDistance: 0.8,
            offersDelivery: false,
            openingHours: {
              monday: { open: "09:00", close: "17:00" },
              tuesday: { open: "09:00", close: "17:00" },
              wednesday: { open: "09:00", close: "17:00" },
              thursday: { open: "09:00", close: "17:00" },
              friday: { open: "09:00", close: "17:00" },
              saturday: { open: "08:00", close: "13:00" },
            },
            specialNotes: "• ID required for first visit\n• New food deliveries arrive on Mondays and Thursdays\n• Please bring your own bags if possible\n• Most produce requires washing before consumption\n• Limit of one visit per week per household"
          }
        ];
        
        setFavorites(mockFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast({
          title: "Error",
          description: "Failed to load your saved pantries",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user, navigate, toast]);
  
  const handleReserve = (pantryId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to reserve food",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    createReservation({
      pantryId,
      notes: "",
    });
    
    toast({
      title: "Reservation Successful",
      description: "Your food reservation has been submitted",
    });
  };
  
  const handleContact = (pantryId: string) => {
    setContactPantryId(pantryId);
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="app-container pb-16 md:pb-0">
      <Header />
      <LocationBar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-heading font-bold mb-6">Saved Food Pantries</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow overflow-hidden h-64 animate-pulse">
                <div className="flex md:flex-row flex-col h-full">
                  <div className="md:w-1/3 h-40 md:h-auto bg-gray-200"></div>
                  <div className="p-4 md:w-2/3 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((pantry) => (
              <PantryCard
                key={pantry.id}
                pantry={pantry}
                onReserve={handleReserve}
                onContact={handleContact}
              />
            ))}
          </div>
        ) : (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">No saved pantries</h3>
            <p className="text-gray-500 mb-4">
              You haven't saved any food pantries yet. Click the heart icon on any pantry to save it for later.
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-primary font-medium"
            >
              Find Food Resources →
            </button>
          </div>
        )}
      </div>
      
      {selectedPantryId && pantry && (
        <PantryDetail
          pantry={pantry}
          foodItems={foodItems}
          reviews={reviews}
          visible={!!selectedPantryId}
          onClose={() => setSelectedPantryId(null)}
        />
      )}
      
      <BottomNavigation />
    </div>
  );
}
