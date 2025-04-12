import { useState, useEffect, useCallback } from "react";
import { useLocation as useRouterLocation } from "wouter";
import Header from "@/components/Header";
import LocationBar from "@/components/LocationBar";
import BottomNavigation from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import PantryCard from "@/components/PantryCard";
import PantryDetail from "@/components/PantryDetail";
import { useLocation } from "@/hooks/useLocation";
import { usePantries, usePantryDetails } from "@/hooks/usePantries";
import { Pantry, PantryFilter } from "@/types";
import { debounce } from "@/lib/utils";
import { useReservations } from "@/hooks/useReservations";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Search() {
  const [, navigate] = useRouterLocation();
  const { location } = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Pantry[]>([]);
  const [selectedPantryId, setSelectedPantryId] = useState<string | null>(null);
  const [contactPantryId, setContactPantryId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { createReservation } = useReservations();
  
  // Get all pantries for searching
  const { pantries, isLoading } = usePantries(
    location ? { latitude: location.latitude, longitude: location.longitude } : null
  );
  
  const { pantry, foodItems, reviews } = usePantryDetails(selectedPantryId || undefined);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setIsSearching(true);
      
      if (!term.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      const lowerTerm = term.toLowerCase();
      const results = pantries.filter(
        (pantry) =>
          pantry.name.toLowerCase().includes(lowerTerm) ||
          pantry.description?.toLowerCase().includes(lowerTerm) ||
          pantry.address.toLowerCase().includes(lowerTerm)
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300),
    [pantries]
  );
  
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      <LocationBar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold mb-4">Search Food Resources</h1>
          <Input
            placeholder="Search by name, address, or food type"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <div className="space-y-4">
          {isLoading || isSearching ? (
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
          ) : searchTerm.trim() === "" ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">Start searching</h3>
              <p className="text-gray-500 mb-4">
                Enter a location, food type, or pantry name to find resources
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <h2 className="text-md font-medium mb-4">
                Found {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
              </h2>
              <div className="space-y-4">
                {searchResults.map((pantry) => (
                  <PantryCard
                    key={pantry.id}
                    pantry={pantry}
                    onReserve={handleReserve}
                    onContact={handleContact}
                  />
                ))}
              </div>
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
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">
                We couldn't find any pantries matching "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-primary font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
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
