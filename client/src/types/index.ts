// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  profileImage?: string;
  isAdmin?: boolean;
  location?: UserLocation;
}

export interface UserLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
}

// Pantry types
export interface Pantry {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  imageUrl?: string;
  adminId?: string;
  walkingDistance?: number;
  offersDelivery?: boolean;
  openingHours?: OpeningHours;
  specialNotes?: string;
  distance?: number; // Calculated field
}

export interface OpeningHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

// Food item types
export interface FoodItem {
  id: string;
  pantryId: string;
  name: string;
  category: string;
  inStock: boolean;
  quantity?: string;
  freshness?: string;
  deliveryDate?: Date;
  dietaryType?: DietaryType;
  preparationRequired?: string;
}

export interface DietaryType {
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  pantryId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  user?: {
    displayName: string;
    profileImage?: string;
  };
}

// Favorite types
export interface Favorite {
  id: string;
  userId: string;
  pantryId: string;
  pantry?: Pantry;
}

// Reservation types
export interface Reservation {
  id: string;
  userId: string;
  pantryId: string;
  reservationDate: Date;
  status: 'pending' | 'confirmed' | 'canceled';
  notes?: string;
  pantry?: Pantry;
}

// Filter types
export interface PantryFilter {
  isOpen?: boolean;
  maxDistance?: number;
  walkingDistance?: boolean;
  offersDelivery?: boolean;
  minRating?: number;
  categories?: string[];
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  };
  preparationRequired?: string[];
  freshness?: string;
}
