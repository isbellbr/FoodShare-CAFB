import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pantry, PantryFilter, FoodItem, Review } from "@/types";
import { getPantryStatus } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

// Helper function to convert number IDs to string IDs expected by frontend
const convertPantry = (pantry: any): Pantry => {
  return {
    ...pantry,
    id: pantry.id.toString(), // Convert number ID to string
    adminId: pantry.adminId?.toString() || undefined
  };
}

export const usePantries = (
  userLocation: { latitude: number; longitude: number } | null,
  filters: PantryFilter = {}
) => {
  const { data: pantries = [], isLoading, error } = useQuery({
    queryKey: ["pantries"],
    queryFn: async () => {
      console.log("Fetching pantries from API");
      try {
        const response = await apiRequest<any[]>("/api/pantries");
        console.log("API response:", response);
        
        // Convert number IDs to string IDs for client-side compatibility
        const convertedPantries = response.map((pantry: any) => convertPantry(pantry));
        console.log("Converted pantries:", convertedPantries);
        
        return convertedPantries;
      } catch (error) {
        console.error("Error fetching pantries:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate distances if we have user location
  const pantriesWithDistance = useMemo(() => {
    if (!userLocation) return pantries;

    return pantries.map((pantry) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        pantry.latitude,
        pantry.longitude
      );

      return {
        ...pantry,
        distance,
      };
    });
  }, [pantries, userLocation]);

  // Apply filters
  const filteredPantries = useMemo(() => {
    let result = [...pantriesWithDistance];

    // Filter by open status
    if (filters.isOpen) {
      result = result.filter((pantry) => {
        const { status } = getPantryStatus(pantry.openingHours);
        return status === "open" || status === "closing";
      });
    }

    // Filter by max distance
    if (filters.maxDistance && userLocation) {
      result = result.filter((pantry) => pantry.distance! <= filters.maxDistance!);
    }

    // Filter by walking distance
    if (filters.walkingDistance) {
      result = result.filter((pantry) => 
        pantry.walkingDistance !== undefined || 
        pantry.distance! <= 1
      );
    }

    // Filter by delivery
    if (filters.offersDelivery) {
      result = result.filter((pantry) => pantry.offersDelivery);
    }

    // Filter by min rating (would need to fetch ratings for each pantry)
    // In a real app, this would come from a backend query

    // Sort by distance
    if (userLocation) {
      result.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    return result;
  }, [pantriesWithDistance, filters, userLocation]);

  return {
    pantries: filteredPantries,
    isLoading,
    error,
  };
};

// Helper function to convert number IDs to string IDs expected by frontend for food items
const convertFoodItem = (item: any): FoodItem => {
  return {
    ...item,
    id: item.id.toString(),
    pantryId: item.pantryId.toString()
  };
};

// Helper function to convert number IDs to string IDs expected by frontend for reviews
const convertReview = (review: any): Review => {
  return {
    ...review,
    id: review.id.toString(),
    userId: review.userId.toString(),
    pantryId: review.pantryId.toString(),
    createdAt: new Date(review.createdAt)
  };
};

export const usePantryDetails = (
  pantryId: string | undefined
) => {
  const [selectedPantry, setSelectedPantry] = useState<Pantry | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pantryId) {
      setIsLoading(false);
      return;
    }

    const fetchPantryDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get pantry details from API
        const pantry = await apiRequest<any>(`/api/pantries/${pantryId}`);
        
        if (!pantry) {
          setError("Pantry not found");
          setIsLoading(false);
          return;
        }

        setSelectedPantry(convertPantry(pantry));

        // Fetch food items for this pantry
        const foodItemsRes = await apiRequest<any[]>(`/api/pantries/${pantryId}/food-items`);
        setFoodItems(foodItemsRes.map((item: any) => convertFoodItem(item)));

        // Fetch reviews
        const reviewsRes = await apiRequest<any[]>(`/api/pantries/${pantryId}/reviews`);
        setReviews(reviewsRes.map((review: any) => convertReview(review)));
      } catch (err) {
        console.error("Error fetching pantry details:", err);
        setError("Failed to load pantry details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPantryDetails();
  }, [pantryId]);

  return {
    pantry: selectedPantry,
    foodItems,
    reviews,
    isLoading,
    error,
  };
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return parseFloat(distance.toFixed(2));
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
