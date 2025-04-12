import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/hooks/use-toast";

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LocationModal({ open, onOpenChange }: LocationModalProps) {
  const { getCurrentLocation, setLocation } = useLocation();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    try {
      await getCurrentLocation();
      onOpenChange(false);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualAddress = async () => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter an address to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use Google Maps Geocoding API to convert address to coordinates
      // Hardcode Google Maps API Key to avoid environment variable issues
      const googleMapsApiKey = "AIzaSyBoRd8cypQqd8tWw7OIPajdpDEmfVUVhXQ";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${googleMapsApiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({
          latitude: lat,
          longitude: lng,
          address: data.results[0].formatted_address,
        });
        
        toast({
          title: "Location Set",
          description: `Using location: ${data.results[0].formatted_address}`,
        });
        
        onOpenChange(false);
      } else {
        toast({
          title: "Location Error",
          description: "Could not find the specified address. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      toast({
        title: "Location Error",
        description: "Failed to process the address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Location</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500">
            We need your location to find food pantries near you.
          </p>
          
          <Button 
            className="w-full"
            onClick={handleCurrentLocation}
            disabled={isLoading}
          >
            {isLoading ? "Detecting Location..." : "Use My Current Location"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleManualAddress}
              disabled={isLoading}
            >
              {isLoading ? "Setting Location..." : "Use This Address"}
            </Button>
          </div>
        </div>
        <DialogFooter className="text-xs text-gray-500">
          Your location is only used to find nearby food resources.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
