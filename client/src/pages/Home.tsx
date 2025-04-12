import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import LocationBar from "@/components/LocationBar";
import Filters from "@/components/Filters";
import MapView from "@/components/MapView";
import PantryCard from "@/components/PantryCard";
import BottomNavigation from "@/components/BottomNavigation";
import PantryDetail from "@/components/PantryDetail";
import { useLocation as useUserLocation } from "@/hooks/useLocation";
import { usePantries, usePantryDetails } from "@/hooks/usePantries";
import { useReservations } from "@/hooks/useReservations";
import { PantryFilter } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { location, setShowLocationModal, showLocationModal, getCurrentLocation } = useUserLocation();
  const [filters, setFilters] = useState<PantryFilter>({ isOpen: true });
  const [showMapView, setShowMapView] = useState<boolean>(true);
  const [selectedPantryId, setSelectedPantryId] = useState<string | null>(null);
  const [contactPantryId, setContactPantryId] = useState<string | null>(null);
  const { toast } = useToast();
  const { createReservation } = useReservations();
  
  const { pantries, isLoading } = usePantries(
    location ? { latitude: location.latitude, longitude: location.longitude } : null,
    filters
  );
  
  const { pantry, foodItems, reviews } = usePantryDetails(selectedPantryId || undefined);
  
  const handleSearch = () => {
    navigate("/search");
  };
  
  const handleToggleView = () => {
    setShowMapView(!showMapView);
  };
  
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
  
  const contactPantry = pantries.find(p => p.id === contactPantryId);
  
  return (
    <div className="app-container pb-16 md:pb-0">
      <Header onSearch={handleSearch} />
      <LocationBar />
      <Filters 
        filters={filters} 
        setFilters={setFilters} 
        totalResults={pantries.length} 
      />
      
      {showMapView && (
        <MapView 
          pantries={pantries} 
          userLocation={location} 
          onToggleView={handleToggleView} 
        />
      )}
      
      <div className="container mx-auto px-4 pb-4">
        <h2 className="text-xl font-heading font-semibold mb-4">
          {isLoading ? (
            <div className="h-7 bg-gray-200 animate-pulse rounded w-48"></div>
          ) : (
            `Available Today (${pantries.length})`
          )}
        </h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
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
        ) : pantries.length > 0 ? (
          <div className="space-y-4">
            {pantries.map((pantry) => (
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">No pantries found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or location to find more results
            </p>
            <button
              onClick={() => setFilters({})}
              className="text-primary font-medium"
            >
              Clear all filters
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
      
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Your Location</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              We need your location to find food pantries near you. Please allow location access or enter your address.
            </p>
            <Button 
              className="w-full mb-2"
              onClick={getCurrentLocation}
            >
              Use My Current Location
            </Button>
            <p className="text-xs text-center text-gray-500">
              Or
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => {
                // For demo, set a default location
                if (location) return;
                const defaultLocation = {
                  latitude: 37.7749,
                  longitude: -122.4194,
                  address: "San Francisco, CA"
                };
                toast({
                  title: "Location Set",
                  description: "Using default location: San Francisco, CA",
                });
                setShowLocationModal(false);
              }}
            >
              Use Default Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!contactPantryId} onOpenChange={(open) => !open && setContactPantryId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {contactPantry?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {contactPantry ? (
              <div className="space-y-4">
                {contactPantry.contactPhone && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Phone:</h3>
                    <a 
                      href={`tel:${contactPantry.contactPhone}`} 
                      className="text-primary block"
                    >
                      {contactPantry.contactPhone}
                    </a>
                  </div>
                )}
                
                {contactPantry.contactEmail && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Email:</h3>
                    <a 
                      href={`mailto:${contactPantry.contactEmail}`}
                      className="text-primary block"
                    >
                      {contactPantry.contactEmail}
                    </a>
                  </div>
                )}
                
                {contactPantry.website && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Website:</h3>
                    <a 
                      href={contactPantry.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary block"
                    >
                      {contactPantry.website}
                    </a>
                  </div>
                )}
                
                {!contactPantry.contactPhone && !contactPantry.contactEmail && !contactPantry.website && (
                  <p className="text-sm text-gray-500">
                    No contact information available for this pantry.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Contact information not available
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setContactPantryId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
}
