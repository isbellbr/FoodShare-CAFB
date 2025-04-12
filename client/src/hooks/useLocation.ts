import { useState, useEffect, createContext, useContext } from "react";
import { useToast } from "@/hooks/use-toast";

interface LocationContextType {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  setLocation: (location: { latitude: number; longitude: number; address: string } | null) => void;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
}

export const LocationContext = createContext<LocationContextType>({
  location: null,
  setLocation: () => {},
  loading: false,
  error: null,
  getCurrentLocation: async () => {},
  showLocationModal: false,
  setShowLocationModal: () => {},
});

export const useLocationProvider = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { toast } = useToast();

  // Try to get the location from localStorage on init
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (err) {
        console.error("Error parsing saved location:", err);
        localStorage.removeItem("userLocation");
      }
    } else {
      setShowLocationModal(true);
    }
  }, []);

  // Save location to localStorage when it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem("userLocation", JSON.stringify(location));
    }
  }, [location]);

  const getCurrentLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      // Use Google Maps Geocoding API to get address
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
          }`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setLocation({ latitude, longitude, address });
        } else {
          setLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }
      } catch (err) {
        console.error("Error geocoding:", err);
        setLocation({
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
      }
    } catch (err: any) {
      console.error("Error getting current location:", err);
      
      if (err.code === 1) {
        setError("Permission denied. Please enable location permissions.");
        toast({
          title: "Location Permission Denied",
          description: "Please enable location access in your browser settings to find food near you.",
          variant: "destructive",
        });
      } else if (err.code === 2) {
        setError("Location unavailable. Please try again.");
        toast({
          title: "Location Unavailable",
          description: "Could not get your current location. Please try again later.",
          variant: "destructive",
        });
      } else {
        setError("Error getting location. Please try again.");
        toast({
          title: "Location Error",
          description: "An error occurred while trying to get your location.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    setLocation,
    loading,
    error,
    getCurrentLocation,
    showLocationModal,
    setShowLocationModal,
  };
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
