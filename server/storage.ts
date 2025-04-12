import {
  type User, type InsertUser,
  type Pantry, type InsertPantry,
  type FoodItem, type InsertFoodItem,
  type Review, type InsertReview,
  type Favorite, type InsertFavorite,
  type Reservation, type InsertReservation,
  users, pantries, foodItems, reviews, favorites, reservations
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;

  // Pantries
  getPantry(id: number): Promise<Pantry | undefined>;
  getAllPantries(): Promise<Pantry[]>;
  createPantry(pantry: InsertPantry): Promise<Pantry>;
  updatePantry(id: number, pantryData: Partial<Pantry>): Promise<Pantry | undefined>;
  deletePantry(id: number): Promise<boolean>;
  getNearbyPantries(lat: number, lng: number, radius: number): Promise<Pantry[]>;
  
  // Food Items
  getFoodItems(pantryId: number): Promise<FoodItem[]>;
  createFoodItem(item: InsertFoodItem): Promise<FoodItem>;
  updateFoodItem(id: number, itemData: Partial<FoodItem>): Promise<FoodItem | undefined>;
  deleteFoodItem(id: number): Promise<boolean>;
  
  // Reviews
  getPantryReviews(pantryId: number): Promise<Review[]>;
  getUserReviews(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: number): Promise<boolean>;
  
  // Favorites
  getUserFavorites(userId: number): Promise<Pantry[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, pantryId: number): Promise<boolean>;
  
  // Reservations
  getUserReservations(userId: number): Promise<Reservation[]>;
  getPantryReservations(pantryId: number): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservationStatus(id: number, status: string): Promise<Reservation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pantries: Map<number, Pantry>;
  private foodItems: Map<number, FoodItem>;
  private reviews: Map<number, Review>;
  private favorites: Map<number, Favorite>;
  private reservations: Map<number, Reservation>;
  
  private currentUserId: number;
  private currentPantryId: number;
  private currentFoodItemId: number;
  private currentReviewId: number;
  private currentFavoriteId: number;
  private currentReservationId: number;

  constructor() {
    this.users = new Map();
    this.pantries = new Map();
    this.foodItems = new Map();
    this.reviews = new Map();
    this.favorites = new Map();
    this.reservations = new Map();
    
    this.currentUserId = 1;
    this.currentPantryId = 1;
    this.currentFoodItemId = 1;
    this.currentReviewId = 1;
    this.currentFavoriteId = 1;
    this.currentReservationId = 1;
    
    // Add initial sample data
    this.initializeData();
  }

  // Initialize with sample data
  private initializeData() {
    // Sample admin user
    const adminUser: InsertUser = {
      username: "admin",
      password: "admin123", // In production, this would be hashed
      email: "admin@foodshare.org",
      displayName: "Admin",
      isAdmin: true,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: "San Francisco, CA"
      }
    };
    
    this.createUser(adminUser);
    
    // Sample pantries
    const samplePantries: InsertPantry[] = [
      {
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
      },
      {
        name: "Community Hope Center",
        description: "Neighborhood food distribution with hot meals and delivery options.",
        address: "456 Hope St, Phoenix, AZ 85001",
        latitude: 37.773,
        longitude: -122.418,
        contactPhone: "(602) 555-2345",
        contactEmail: "contact@communityhopecenter.org",
        imageUrl: "https://images.unsplash.com/photo-1544427920-c49ccfb85579",
        adminId: 1,
        walkingDistance: 1.2,
        offersDelivery: true,
        openingHours: {
          monday: { open: "10:00", close: "15:00" },
          tuesday: { open: "10:00", close: "15:00" },
          wednesday: { open: "10:00", close: "15:00" },
          thursday: { open: "10:00", close: "15:00" },
          friday: { open: "10:00", close: "15:00" },
        },
        specialNotes: "• Hot meals served from 11:30 AM to 1:30 PM\n• Delivery available for seniors and disabled individuals\n• Vegetarian options available daily"
      },
      {
        name: "Neighborhood Relief Kitchen",
        description: "Local kitchen offering fresh ingredients and prepared meals.",
        address: "789 Main St, Phoenix, AZ 85002",
        latitude: 37.775,
        longitude: -122.415,
        contactPhone: "(602) 555-3456",
        contactEmail: "help@reliefkitchen.org",
        imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
        adminId: 1,
        walkingDistance: 0.5,
        offersDelivery: false,
        openingHours: {
          monday: { open: "11:00", close: "19:00" },
          tuesday: { open: "11:00", close: "19:00" },
          wednesday: { open: "11:00", close: "19:00" },
          thursday: { open: "11:00", close: "19:00" },
          friday: { open: "11:00", close: "19:00" },
          saturday: { open: "11:00", close: "19:00" },
        },
        specialNotes: "• Gluten-free options available\n• Fresh produce deliveries on Tuesday and Friday\n• Bring reusable containers for prepared meals"
      }
    ];
    
    samplePantries.forEach(pantry => this.createPantry(pantry));
    
    // Sample food items
    const foodItemsSample: InsertFoodItem[] = [
      {
        pantryId: 1,
        name: "Fresh Vegetables",
        category: "Produce",
        inStock: true,
        quantity: "High Quantity",
        freshness: "Fresh",
        deliveryDate: new Date(),
        dietaryType: {
          vegetarian: true,
          vegan: true,
          glutenFree: true,
          dairyFree: true
        },
        preparationRequired: "Minimal"
      },
      {
        pantryId: 1,
        name: "Milk and Cheese",
        category: "Dairy",
        inStock: true,
        quantity: "Limited",
        freshness: "Fresh",
        deliveryDate: new Date(),
        dietaryType: {
          vegetarian: true,
        },
        preparationRequired: "None"
      },
      {
        pantryId: 1,
        name: "Bread",
        category: "Bread",
        inStock: true,
        quantity: "High Quantity",
        freshness: "Fresh",
        deliveryDate: new Date(),
        dietaryType: {
          vegetarian: true,
          vegan: true,
        },
        preparationRequired: "None"
      },
      {
        pantryId: 1,
        name: "Canned Soup",
        category: "Canned Goods",
        inStock: true,
        quantity: "High Quantity",
        freshness: "N/A",
        dietaryType: {},
        preparationRequired: "Minimal"
      },
      {
        pantryId: 1,
        name: "Chicken",
        category: "Meat",
        inStock: false,
        quantity: "Out of Stock",
        dietaryType: {},
        preparationRequired: "Cooking"
      },
      {
        pantryId: 2,
        name: "Hot Meals",
        category: "Prepared Food",
        inStock: true,
        quantity: "High Quantity",
        freshness: "Fresh",
        deliveryDate: new Date(),
        dietaryType: {
          vegetarian: true
        },
        preparationRequired: "None"
      },
      {
        pantryId: 3,
        name: "Assorted Fruits",
        category: "Produce",
        inStock: true,
        quantity: "High Quantity",
        freshness: "Fresh",
        deliveryDate: new Date(),
        dietaryType: {
          vegetarian: true,
          vegan: true,
          glutenFree: true,
          dairyFree: true
        },
        preparationRequired: "Minimal"
      }
    ];
    
    foodItemsSample.forEach(item => this.createFoodItem(item));
    
    // Sample reviews
    const reviewsSample: InsertReview[] = [
      {
        userId: 1,
        pantryId: 1,
        rating: 5,
        comment: "Great experience! The staff was very friendly and helpful. They had a good selection of fresh produce and bread. I was able to get enough food for my family for several days.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId: 1,
        pantryId: 2,
        rating: 4,
        comment: "The line was quite long but moved quickly. They had a good variety of food, but were out of meat when I visited. The produce was fresh, and they also had some gluten-free options which was nice!",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    ];
    
    reviewsSample.forEach(review => this.createReview(review));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Pantry methods
  async getPantry(id: number): Promise<Pantry | undefined> {
    return this.pantries.get(id);
  }

  async getAllPantries(): Promise<Pantry[]> {
    return Array.from(this.pantries.values());
  }

  async createPantry(pantry: InsertPantry): Promise<Pantry> {
    const id = this.currentPantryId++;
    const newPantry: Pantry = { ...pantry, id };
    this.pantries.set(id, newPantry);
    return newPantry;
  }

  async updatePantry(id: number, pantryData: Partial<Pantry>): Promise<Pantry | undefined> {
    const pantry = await this.getPantry(id);
    if (!pantry) return undefined;
    
    const updatedPantry = { ...pantry, ...pantryData };
    this.pantries.set(id, updatedPantry);
    return updatedPantry;
  }

  async deletePantry(id: number): Promise<boolean> {
    return this.pantries.delete(id);
  }

  async getNearbyPantries(lat: number, lng: number, radius: number): Promise<Pantry[]> {
    // Simple implementation for in-memory storage
    // In a real app, we would use geospatial queries
    return Array.from(this.pantries.values()).filter(pantry => {
      // Calculate distance using Haversine formula
      const distance = this.calculateDistance(
        lat, lng, 
        pantry.latitude, pantry.longitude
      );
      
      return distance <= radius;
    });
  }

  // Helper to calculate distance between coordinates using Haversine formula
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3958.8; // Earth radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  // Food Item methods
  async getFoodItems(pantryId: number): Promise<FoodItem[]> {
    return Array.from(this.foodItems.values()).filter(
      item => item.pantryId === pantryId
    );
  }

  async createFoodItem(item: InsertFoodItem): Promise<FoodItem> {
    const id = this.currentFoodItemId++;
    const newItem: FoodItem = { ...item, id };
    this.foodItems.set(id, newItem);
    return newItem;
  }

  async updateFoodItem(id: number, itemData: Partial<FoodItem>): Promise<FoodItem | undefined> {
    const item = this.foodItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemData };
    this.foodItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteFoodItem(id: number): Promise<boolean> {
    return this.foodItems.delete(id);
  }

  // Review methods
  async getPantryReviews(pantryId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.pantryId === pantryId
    );
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.userId === userId
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const newReview: Review = { ...review, id };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }

  // Favorite methods
  async getUserFavorites(userId: number): Promise<Pantry[]> {
    const userFavorites = Array.from(this.favorites.values()).filter(
      fav => fav.userId === userId
    );
    
    const favoritePantries: Pantry[] = [];
    for (const fav of userFavorites) {
      const pantry = await this.getPantry(fav.pantryId);
      if (pantry) favoritePantries.push(pantry);
    }
    
    return favoritePantries;
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    // Check if already exists
    const existing = Array.from(this.favorites.values()).find(
      fav => fav.userId === favorite.userId && fav.pantryId === favorite.pantryId
    );
    
    if (existing) return existing;
    
    const id = this.currentFavoriteId++;
    const newFavorite: Favorite = { ...favorite, id };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavorite(userId: number, pantryId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.pantryId === pantryId
    );
    
    if (!favorite) return false;
    return this.favorites.delete(favorite.id);
  }

  // Reservation methods
  async getUserReservations(userId: number): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      res => res.userId === userId
    );
  }

  async getPantryReservations(pantryId: number): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      res => res.pantryId === pantryId
    );
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = this.currentReservationId++;
    const newReservation: Reservation = { ...reservation, id };
    this.reservations.set(id, newReservation);
    return newReservation;
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, status };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }
}

export const storage = new MemStorage();
