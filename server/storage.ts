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
        latitude: 33.45,
        longitude: -112.07,
        address: "Phoenix, AZ"
      }
    };
    
    this.createUser(adminUser);
    
    // Sample pantries
    const samplePantries: InsertPantry[] = [
      {
        name: "St. Mary's Food Bank",
        description: "Community food bank offering fresh produce, dairy, and canned goods.",
        address: "2831 N 31st Ave, Phoenix, AZ 85009",
        latitude: 33.478,
        longitude: -112.126,
        contactPhone: "(602) 555-1234",
        contactEmail: "info@stmarysfoodbank.org",
        imageUrl: "https://cdn.arizonasports.com/arizonasports/wp-content/uploads/2023/10/ckcnnp8ocqmompwk5dpw-1-e1698792777180.jpg",
        adminId: 1,
        walkingDistance: 0.8,
        offersDelivery: false,
        openingHours: {
          monday: { open: "09:00", close: "17:00" },
          tuesday: { open: "09:00", close: "17:00" },
          wednesday: { open: "09:00", close: "17:00" },
          thursday: { open: "09:00", close: "17:00" },
          friday: { open: "09:00", close: "23:00" },
          saturday: { open: "08:00", close: "13:00" },
        },
        specialNotes: "• ID required for first visit\n• New food deliveries arrive on Mondays and Thursdays\n• Please bring your own bags if possible\n• Most produce requires washing before consumption\n• Limit of one visit per week per household"
      },
      {
        name: "Community Hope Center",
        description: "Neighborhood food distribution with hot meals and delivery options.",
        address: "456 Hope St, Phoenix, AZ 85001",
        latitude: 33.454,
        longitude: -112.075,
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
        latitude: 33.495,
        longitude: -112.098,
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
      },
      {
        name: "Phoenix Community Pantry",
        description: "Local pantry with fresh produce and non-perishable items.",
        address: "123 Community Ave, Phoenix, AZ 85003",
        latitude: 33.442,
        longitude: -112.068,
        contactPhone: "(602) 555-4567",
        contactEmail: "info@phoenixpantry.org",
        imageUrl: "https://www.azcentral.com/gcdn/-mm-/60d2f7e2369715e9fb7e4427c90d8e0e179eca29/c=0-78-1087-692/local/-/media/2017/08/07/Phoenix/Phoenix/636377347805580426-thumb-DSC-0198-1024.jpg?width=660&height=371&fit=crop&format=pjpg&auto=webp",
        adminId: 1,
        walkingDistance: 0.3,
        offersDelivery: true,
        openingHours: {
          monday: { open: "08:00", close: "18:00" },
          tuesday: { open: "08:00", close: "18:00" },
          wednesday: { open: "08:00", close: "18:00" },
          thursday: { open: "08:00", close: "18:00" },
          friday: { open: "08:00", close: "18:00" },
          saturday: { open: "09:00", close: "14:00" },
        },
        specialNotes: "• Proof of residence required\n• Specializes in culturally diverse food options\n• Weekly cooking classes available"
      },
      {
        name: "Desert Sun Food Share",
        description: "Friendly neighborhood pantry with weekly distributions.",
        address: "555 Camelback Rd, Phoenix, AZ 85014",
        latitude: 33.509,
        longitude: -112.073,
        contactPhone: "(602) 555-5678",
        contactEmail: "help@desertsunfood.org",
        imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd",
        adminId: 1,
        walkingDistance: 0.6,
        offersDelivery: false,
        openingHours: {
          tuesday: { open: "09:00", close: "16:00" },
          thursday: { open: "09:00", close: "16:00" },
          saturday: { open: "10:00", close: "15:00" },
        },
        specialNotes: "• Fresh bread available early morning\n• Diaper bank available for families with children\n• Monthly health screenings available"
      },
      {
        name: "Casa de Esperanza",
        description: "Hispanic-focused pantry with cultural food options and resources.",
        address: "777 Esperanza Blvd, Phoenix, AZ 85006",
        latitude: 33.467,
        longitude: -112.055,
        contactPhone: "(602) 555-6789",
        contactEmail: "info@casaesperanza.org",
        imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e",
        adminId: 1,
        walkingDistance: 1.0,
        offersDelivery: true,
        openingHours: {
          monday: { open: "10:00", close: "16:00" },
          wednesday: { open: "10:00", close: "16:00" },
          friday: { open: "10:00", close: "16:00" },
        },
        specialNotes: "• Bilingual staff available\n• Traditional Hispanic ingredients\n• Immigration resource center on-site"
      },
      {
        name: "University Food Assistance",
        description: "Student-focused pantry near campus with grab-and-go options.",
        address: "1200 University Dr, Phoenix, AZ 85004",
        latitude: 33.424,
        longitude: -112.048,
        contactPhone: "(602) 555-7890",
        contactEmail: "foodassist@university.edu",
        imageUrl: "https://bloximages.chicago2.vip.townnews.com/tucson.com/content/tncms/assets/v3/editorial/2/72/2722bdd6-ba45-11ee-b988-8bc5ddda91ed/65b04852af60b.image.jpg?resize=762%2C500",
        adminId: 1,
        walkingDistance: 0.2,
        offersDelivery: false,
        openingHours: {
          monday: { open: "07:30", close: "19:30" },
          tuesday: { open: "07:30", close: "19:30" },
          wednesday: { open: "07:30", close: "19:30" },
          thursday: { open: "07:30", close: "19:30" },
          friday: { open: "07:30", close: "17:00" },
        },
        specialNotes: "• Student ID required\n• Quick grab-and-go meals available\n• Meal vouchers for campus dining"
      }, {
        name: "Tempe Community Pantry",
        description: "Provides essential groceries and hygiene products for low-income residents.",
        address: "1000 Apache Blvd, Tempe, AZ 85281",
        latitude: 33.414,
        longitude: -111.926,
        contactPhone: "(480) 555-1010",
        contactEmail: "support@tempepantry.org",
        imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
        adminId: 1,
        walkingDistance: 1.1,
        offersDelivery: true,
        openingHours: {
          monday: { open: "09:00", close: "17:00" },
          wednesday: { open: "09:00", close: "17:00" },
          friday: { open: "09:00", close: "17:00" },
        },
        specialNotes: "• ID and proof of income required\n• Hygiene kits available weekly\n• Accepts food donations"
      },
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
    // Apply proper defaults to match User type
    const user: User = { 
      ...insertUser, 
      id,
      displayName: insertUser.displayName || null,
      email: insertUser.email || null,
      isAdmin: insertUser.isAdmin || false,
      profileImage: insertUser.profileImage || null,
      location: insertUser.location ? {
        latitude: typeof insertUser.location.latitude === 'number' ? insertUser.location.latitude : undefined,
        longitude: typeof insertUser.location.longitude === 'number' ? insertUser.location.longitude : undefined,
        address: typeof insertUser.location.address === 'string' ? insertUser.location.address : undefined
      } : null,
    };
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
    // Apply proper defaults to match Pantry type
    const newPantry: Pantry = { 
      ...pantry, 
      id,
      description: pantry.description || null,
      contactPhone: pantry.contactPhone || null,
      contactEmail: pantry.contactEmail || null,
      website: pantry.website || null,
      imageUrl: pantry.imageUrl || null,
      offersDelivery: pantry.offersDelivery || false,
      walkingDistance: pantry.walkingDistance || null,
      specialNotes: pantry.specialNotes || null,
      // Ensure adminId is null and not undefined
      adminId: pantry.adminId || null,
    };
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
    // Apply proper defaults to match FoodItem type
    const newItem: FoodItem = { 
      ...item, 
      id,
      inStock: item.inStock ?? null,
      quantity: item.quantity || null,
      freshness: item.freshness || null,
      deliveryDate: item.deliveryDate || null,
      dietaryType: item.dietaryType ? {
        vegetarian: typeof item.dietaryType.vegetarian === 'boolean' ? item.dietaryType.vegetarian : undefined,
        vegan: typeof item.dietaryType.vegan === 'boolean' ? item.dietaryType.vegan : undefined,
        glutenFree: typeof item.dietaryType.glutenFree === 'boolean' ? item.dietaryType.glutenFree : undefined,
        dairyFree: typeof item.dietaryType.dairyFree === 'boolean' ? item.dietaryType.dairyFree : undefined
      } : null,
      preparationRequired: item.preparationRequired || null,
    };
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
    const newReview: Review = { 
      ...review, 
      id,
      comment: review.comment || null,
      createdAt: review.createdAt || new Date()
    };
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
    const newReservation: Reservation = {
      ...reservation,
      id,
    };
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
