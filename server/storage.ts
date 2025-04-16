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
        "name":"Academy of Hope",
        "description":"",
        "address":"2315 18th Pl NE Washington DC 20018",
        "latitude":38.9207541,
        "longitude":-76.9777389603,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.2247829381,
        "offersDelivery":false,
        "openingHours":{
          "4th wednesday of the month":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Ambassador Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"1408 Minnesota Ave SE Washington DC 20020",
        "latitude":38.86692085,
        "longitude":-76.9843593069,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.8447477747,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"08:00",
            "close":"10:00"
          }
        },
        "specialNotes":"Full Choice"
      },
      {
        "name":"Brotherhood of the Cross and Star",
        "description":"Loose groceries",
        "address":"6001 Georgia Ave NW Washington DC 20011",
        "latitude":38.96311585,
        "longitude":-77.0274202999,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":5.1524010784,
        "offersDelivery":false,
        "openingHours":{
          "3rd friday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":"Full Choice"
      },
      {
        "name":"SeVerna",
        "description":"",
        "address":"43 K St NW Washington DC 20001",
        "latitude":38.90285,
        "longitude":-77.01162,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":7.1934584641,
        "offersDelivery":false,
        "openingHours":{
          "3rd wednesday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Lederer Gardens",
        "description":"Pre-bagged or boxed groceries",
        "address":"4801 Nannie Helen Burroughs Ave NE Washington DC 20019",
        "latitude":38.89850345,
        "longitude":-76.9335505332,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.3052796924,
        "offersDelivery":false,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"11:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Full Choice"
      },
      {
        "name":"Faith United Church of Christ",
        "description":"",
        "address":"4900 10th St NE Washington DC 20017",
        "latitude":38.9485524,
        "longitude":-76.9930363616,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.1094641492,
        "offersDelivery":false,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Frederick Douglass Community Center",
        "description":"",
        "address":"2000 Alabama Ave SE Washington DC 20020",
        "latitude":38.8508138,
        "longitude":-76.975832157,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.8115883269,
        "offersDelivery":false,
        "openingHours":{
          "2nd thursday of the month":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Congress Heights Family Success Center",
        "description":"Pre-bagged or boxed groceries",
        "address":"1345 Savannah St SE  Washington DC 20032",
        "latitude":38.843584,
        "longitude":-76.9863752906,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.4280155966,
        "offersDelivery":false,
        "openingHours":{
          "3rd monday of the month":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Full Choice"
      },
      {
        "name":"Garfield Terrace Resident Council",
        "description":"",
        "address":"2301 11th St NW Washington DC 20001",
        "latitude":38.9215178,
        "longitude":-77.0258154567,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.6751322941,
        "offersDelivery":false,
        "openingHours":{
          "4th wednesday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"James Apartments Resident Council",
        "description":"",
        "address":"1425 N St NW Washington DC 20005",
        "latitude":38.90747645,
        "longitude":-77.0331047076,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.6486890175,
        "offersDelivery":false,
        "openingHours":{
          "1st monday of the month":{
            "open":"15:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"James Creek Resident Council",
        "description":"",
        "address":"100 N St SW Washington DC 20024",
        "latitude":38.87446,
        "longitude":-77.01247,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":8.91665621,
        "offersDelivery":false,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Church of Christ",
        "description":"Pre-bagged or boxed groceries",
        "address":"4801 16th St NW Washington DC 20011",
        "latitude":38.9485,
        "longitude":-77.03572,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.9810994435,
        "offersDelivery":false,
        "openingHours":{
          "3rd wednesday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Luke Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"4925 East Capitol St SE Washington DC 20019",
        "latitude":38.8893042,
        "longitude":-76.9307709529,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.9470349989,
        "offersDelivery":false,
        "openingHours":{
          "4th wednesday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"MSB Community Outreach",
        "description":"",
        "address":"2411 Lawrence St NE Washington DC 20018",
        "latitude":38.9319534,
        "longitude":-76.9715324692,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.3822541722,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"09:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Ward Memorial AME Church",
        "description":"",
        "address":"241 42nd St NE Washington DC 20019",
        "latitude":38.89409335,
        "longitude":-76.9422616481,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.6102048897,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"08:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Southern Hills Community Center",
        "description":"",
        "address":"4212 4th St SE Washington DC 20032",
        "latitude":38.8280382,
        "longitude":-76.9997472,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":11.6558593552,
        "offersDelivery":false,
        "openingHours":{
          "4th tuesday of the month":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"City Blossoms",
        "description":"",
        "address":"516 Kennedy St NW Washington DC 20011",
        "latitude":38.9562334,
        "longitude":-77.0206533519,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":5.0154616618,
        "offersDelivery":false,
        "openingHours":{
          "1st thursday of the month":{
            "open":"11:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Chick Armstrong Recreation Center",
        "description":"",
        "address":"25 W Reed Ave Alexandria VA 22305",
        "latitude":38.83723415,
        "longitude":-77.0580736048,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.3606708986,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"08:30",
            "close":"10:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"William Ramsay Recreation Center",
        "description":"",
        "address":"4850 Mark Center Dr Alexandria VA 22311",
        "latitude":38.8299343,
        "longitude":-77.1191301359,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":14.7275940758,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"08:30",
            "close":"10:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Chantilly Baptist Church",
        "description":"",
        "address":"14312 Chantilly Baptist Ln Chantilly VA 220175",
        "latitude":38.39971,
        "longitude":-77.44292,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":49.0280476456,
        "offersDelivery":false,
        "openingHours":{
          "4th tuesday of the month":{
            "open":"13:30",
            "close":"15:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Francis C. Hammond Middle School",
        "description":"",
        "address":"4646 Seminary Rd Alexandria VA 22304",
        "latitude":38.82618915,
        "longitude":-77.1106132087,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":14.6276385334,
        "offersDelivery":false,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Barcroft Elementary School",
        "description":"",
        "address":"700 S Buchanan St Arlington VA 22204",
        "latitude":38.86017515,
        "longitude":-77.1106300066,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":12.899557291,
        "offersDelivery":false,
        "openingHours":{
          "2nd thursday of the month":{
            "open":"15:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Willston Multicultural Center",
        "description":"",
        "address":"6131 Willston Dr Falls Church VA 22044",
        "latitude":38.8703678,
        "longitude":-77.1488201268,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":14.0223831833,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"08:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Culmore United Methodist Church",
        "description":"",
        "address":"3400 Charles St Falls Church VA 22041",
        "latitude":38.85324,
        "longitude":-77.13641,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":14.2437367607,
        "offersDelivery":false,
        "openingHours":{
          "2nd friday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Dale City Christian Church",
        "description":"",
        "address":"14022 Lindendale Rd Dale City VA 22193",
        "latitude":38.64858,
        "longitude":-77.35996,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":32.7412752841,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"James Lee Community Center",
        "description":"",
        "address":"2855 Annandale Rd Falls Church VA 22042",
        "latitude":38.8779035376,
        "longitude":-77.1732948506,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":14.8279106517,
        "offersDelivery":false,
        "openingHours":{
          "2nd monday of the month":{
            "open":"13:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First Agape Baptist Church",
        "description":"",
        "address":"25 W Reed Ave Alexandria VA 22305",
        "latitude":38.83723415,
        "longitude":-77.0580736048,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":12.3606708986,
        "offersDelivery":false,
        "openingHours":{
          "2nd friday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Georgetown South Community Council",
        "description":"",
        "address":"9444 Taney Rd Manassas VA 20110",
        "latitude":38.74097755,
        "longitude":-77.4722765891,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":33.4979638613,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th thursday of the month":{
            "open":"13:30",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Fairmont Gardens Apartments",
        "description":"",
        "address":"4100 Wadsworth Ct Annandale VA 22003",
        "latitude":38.83646,
        "longitude":-77.20381,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":17.794120295,
        "offersDelivery":false,
        "openingHours":{
          "1st and 2nd thursday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Woodrow Wilson Library",
        "description":"",
        "address":"6101 Knollwood Dr Falls Church VA 22041",
        "latitude":38.8846073789,
        "longitude":-77.1899984115,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":15.3766044983,
        "offersDelivery":false,
        "openingHours":{
          "1st and 4th tuesday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Christ the Redeemer Catholic Church",
        "description":"",
        "address":"46833 Harry Byrd Hwy Sterling VA 20164",
        "latitude":39.01752845,
        "longitude":-77.3797118864,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":23.8055302743,
        "offersDelivery":false,
        "openingHours":{
          "2nd tuesday of the month":{
            "open":"10:00",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Maranatha Springfield Church",
        "description":"",
        "address":"5515 Cherokee Ave Suite 102 Alexandria VA 22312",
        "latitude":38.80469,
        "longitude":-77.16711,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":17.7611755267,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Messiah United Methodist Church",
        "description":"",
        "address":"6215 Rolling Rd Springfield VA 22152",
        "latitude":38.7826545,
        "longitude":-77.2340028745,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":21.411009247,
        "offersDelivery":false,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"17:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mount Olive Baptist Church",
        "description":"",
        "address":"1601 13th Rd S Arlington VA 22204",
        "latitude":38.86270985,
        "longitude":-77.0714502814,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":11.3400817865,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Rising Hope Mission Church",
        "description":"",
        "address":"8220 Russell Rd Alexandria VA 22309",
        "latitude":38.8078802961,
        "longitude":-77.0628123123,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":14.2481407538,
        "offersDelivery":false,
        "openingHours":{
          "2nd tuesday of the month":{
            "open":"12:30",
            "close":"14:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Debre Medehanit Eyesus Ethiopian Ortodox Tewahido Church",
        "description":"",
        "address":"13450 Minnieville Rd Woodbridge VA 22192",
        "latitude":38.6696167942,
        "longitude":-77.286115112,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":28.9931188804,
        "offersDelivery":false,
        "openingHours":{
          "4th thursday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Anthony of Padua Catholic Church",
        "description":"",
        "address":"3305 Glen Carlyn Rd Falls Church VA 22041",
        "latitude":38.85695,
        "longitude":-77.13899,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":14.1806369438,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Stephen's United Methodist Church",
        "description":"",
        "address":"9203 Braddock Rd Burke VA 22015",
        "latitude":38.90974,
        "longitude":-77.26246,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":18.2992933489,
        "offersDelivery":false,
        "openingHours":{
          "1st friday of the month":{
            "open":"17:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"United Community",
        "description":"",
        "address":"7511 Fordson Rd Alexandria VA 22306",
        "latitude":38.75378,
        "longitude":-77.08512,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":18.1249827345,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"08:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Coverstone Apartments",
        "description":"",
        "address":"10934 Coverstone Dr Manassas VA 20109",
        "latitude":38.79446,
        "longitude":-77.52208,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":34.1946946159,
        "offersDelivery":false,
        "openingHours":{
          "3rd wednesday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"4-H Club Park and Planning",
        "description":"",
        "address":"4-H Club Park and Planning 2411 Pinebrook Ave Hyattsville MD 20785",
        "latitude":38.92366,
        "longitude":-76.89409,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.1318776611,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 3rd thursday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Alafia Baptist Church",
        "description":"",
        "address":"3623 Eastern Avenue Mount Rainier MD 20712",
        "latitude":38.9359655511,
        "longitude":-76.9645716989,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.9815918829,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th thursday of the month":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Calvary Assembly of Holy Cross",
        "description":"",
        "address":"3505 Hubbard Rd LANDOVER MD 20785",
        "latitude":38.9331541976,
        "longitude":-76.8780221237,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.0575520014,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th wednesday of the month":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Catholic Charities - Montgomery County Family Center",
        "description":"",
        "address":"12247 Georgia Ave Silver Spring MD 20902",
        "latitude":39.0565366886,
        "longitude":-77.0501715862,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.5967476133,
        "offersDelivery":false,
        "openingHours":{
          "1st tuesday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"City of Greenbelt Food Pantry",
        "description":"",
        "address":"15 Crescent Rd Greenbelt MD 20770",
        "latitude":39.00117485,
        "longitude":-76.8787519986,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":3.2684765907,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"13:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"City of Hyattsville",
        "description":"",
        "address":"6201 Belcrest RD Hyattsville MD 20782",
        "latitude":38.9649117,
        "longitude":-76.9516692819,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.8677265489,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Clifton Park Baptist Church",
        "description":"",
        "address":"8818 Piney Branch Road Silver Spring MD 20903",
        "latitude":38.9869091859,
        "longitude":-77.0131849571,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.0531438883,
        "offersDelivery":false,
        "openingHours":{
          "1st saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          },
          "3rd thursday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Faith Temple #2",
        "description":"",
        "address":"2 211 Maryland Park Drive Capital Heights MD 20743",
        "latitude":38.89148,
        "longitude":-76.90921,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.9581777872,
        "offersDelivery":false,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"CMPGC - Belulah Baptist",
        "description":"",
        "address":"6056 old central Ave Capitol Heights MD 20743",
        "latitude":38.88500345,
        "longitude":-76.912713984,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":7.3584771131,
        "offersDelivery":false,
        "openingHours":{
          "3rd friday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"CMPGC - New Craig",
        "description":"",
        "address":"5305 Farmingdale Road Capitol Heights MD 20743",
        "latitude":38.90776,
        "longitude":-76.91512,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":5.791254911,
        "offersDelivery":false,
        "openingHours":{
          "3rd friday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"CMPGC - Oxon Hill",
        "description":"",
        "address":"7711 Livingston Road Oxon Hill MD 20745",
        "latitude":38.7851684694,
        "longitude":-76.9911948571,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":14.4207341509,
        "offersDelivery":false,
        "openingHours":{
          "1st friday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"CMPGC - Seat Pleasant",
        "description":"",
        "address":"5356 Sheriff Road Capitol Heights  MD 20743",
        "latitude":38.90482,
        "longitude":-76.91933,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":5.948096827,
        "offersDelivery":false,
        "openingHours":{
          "2nd friday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Community Outreach and Development CDC",
        "description":"",
        "address":"4715 Marlboro Pike Capitol Heights MD 20743",
        "latitude":38.8737363465,
        "longitude":-76.9334198949,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.015861474,
        "offersDelivery":false,
        "openingHours":{
          "2nd tuesday of the month":{
            "open":"11:00",
            "close":"13:00"
          },
          "4th friday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"HC - Silver Spring",
        "description":"",
        "address":"1500 Forest Glen Rd, Silver Spring MD 20910",
        "latitude":39.01490625,
        "longitude":-77.0351497866,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.5096462876,
        "offersDelivery":false,
        "openingHours":{
          "1st wednesday of the month":{
            "open":"13:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"HC - Germantown",
        "description":"",
        "address":"19801 Observation Drive Germantown MD 20876",
        "latitude":39.1820436,
        "longitude":-77.2428068028,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":21.0759557164,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"13:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Hyattsville Courthouse Parole and Probation",
        "description":"",
        "address":"4990 Rhode Island Ave Hyattsville MD 20781",
        "latitude":38.9502058,
        "longitude":-76.942642758,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.7411883717,
        "offersDelivery":false,
        "openingHours":{
          "3rd monday of the month":{
            "open":"09:00",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Inwood House",
        "description":"",
        "address":"10921 Inwood Avenue Silver Spring MD 20902",
        "latitude":39.03612785,
        "longitude":-77.036379,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.1886616205,
        "offersDelivery":false,
        "openingHours":{
          "2nd tuesday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Latin American Youth Center",
        "description":"",
        "address":"6200  Sheridan St Riverdale MD 20737",
        "latitude":38.9656830788,
        "longitude":-76.9381607178,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.6595405304,
        "offersDelivery":false,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"11:30",
            "close":"13:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Montgomery College - Rockville",
        "description":"",
        "address":"51 Mannakee St Rockville MD 20850",
        "latitude":39.0985195,
        "longitude":-77.1587885468,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":14.0415132104,
        "offersDelivery":false,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Montgomery College - Germantown",
        "description":"",
        "address":"20200 Observation Dr Germantown MD 20876",
        "latitude":39.197692,
        "longitude":-77.254443,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":22.2451093761,
        "offersDelivery":false,
        "openingHours":{
          "1st wednesday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Montgomery College - Takoma Park",
        "description":"",
        "address":"7600 Takoma Ave Takoma Park MD 20912",
        "latitude":38.9854118,
        "longitude":-77.0230843,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.5898209171,
        "offersDelivery":false,
        "openingHours":{
          "3rd wednesday of the month":{
            "open":"14:00",
            "close":"15:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Prince Georges Social Services - Gwynn Park High School",
        "description":"",
        "address":"13800 Brandywine Road Brandywine MD 20613",
        "latitude":38.6948209063,
        "longitude":-76.8298537188,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":21.186386561,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Prince George's Dept of Social Services Shabach",
        "description":"",
        "address":"403 Brightseat road Landover MD 20785",
        "latitude":38.9160198873,
        "longitude":-76.8603178659,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.5764459535,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Prince George's Dept of Social Services SEED",
        "description":"",
        "address":"5819 Eastpine Dr Riverdale MD 20737",
        "latitude":38.9583116453,
        "longitude":-76.9065906607,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.7411533176,
        "offersDelivery":false,
        "openingHours":{
          "3rd monday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Pin Oak Village Senior",
        "description":"",
        "address":"16010 Excalibur Road Bowie MD 20716",
        "latitude":38.9407685,
        "longitude":-76.7252214,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":11.9101969712,
        "offersDelivery":false,
        "openingHours":{
          "1st monday of the month":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Silver Spring UMC",
        "description":"",
        "address":"8900 Georgia Ave Silver Spring MD 20901",
        "latitude":39.00110795,
        "longitude":-77.0342894823,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":5.2410651846,
        "offersDelivery":false,
        "openingHours":{
          "1st thursday of the month":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Southern Friendship Missionary Baptist Church",
        "description":"",
        "address":"4444 Branch Avenue Temple Hills MD 20748",
        "latitude":38.83148,
        "longitude":-76.93091,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.9383418964,
        "offersDelivery":false,
        "openingHours":{
          "1st and 3rd tuesday of the month":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"University of Shady Grove",
        "description":"",
        "address":"9630 Gudelsky Drive Rockville MD 20850",
        "latitude":39.0935532,
        "longitude":-77.2023469,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":15.9071905415,
        "offersDelivery":false,
        "openingHours":{
          "4th monday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Woodland Springs Apartment",
        "description":"",
        "address":"6617 Atwood Street District Heights MD 20747",
        "latitude":38.8610623,
        "longitude":-76.8924232,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":9.2167109585,
        "offersDelivery":false,
        "openingHours":{
          "1st tuesday of the month":{
            "open":"09:30",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Zion Baptist Church (North Campus)",
        "description":"",
        "address":"11005 Dayton St Silver Spring MD 20902",
        "latitude":39.03645,
        "longitude":-77.04318,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":6.5146526957,
        "offersDelivery":false,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"12:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mount Olivet United Methodist Church",
        "description":"",
        "address":"1500 N Glebe Rd Arlington VA 22207",
        "latitude":38.88899755,
        "longitude":-77.1193335544,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":11.9830152029,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"08:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Community Marketplace at Rosedale Rec",
        "description":"",
        "address":"1701 Gales St. NE Washington DC 20002",
        "latitude":38.8976079,
        "longitude":-76.9789889964,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.7370168696,
        "offersDelivery":false,
        "openingHours":{
          "1st saturday of the month":{
            "open":"08:30",
            "close":"10:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Northern Virginia Family Service SERVE",
        "description":"Loose groceries",
        "address":"10056 Dean Dr Manassas VA 20110",
        "latitude":38.7446355,
        "longitude":-77.5006915465,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":34.6942375993,
        "offersDelivery":false,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"09:30",
            "close":"10:30"
          }
        },
        "specialNotes":"Full Choice"
      },
      {
        "name":"Community Marketplace - Reston",
        "description":"Pre-bagged or boxed groceries",
        "address":"12125 Pinecrest Rd Reston VA 20190",
        "latitude":38.9476313,
        "longitude":-77.3294947736,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":21.2416289821,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"08:30",
            "close":"10:30"
          }
        },
        "specialNotes":"Full Choice"
      },
      {
        "name":"Community Marketplace - Arlington",
        "description":"Pre-bagged or boxed groceries",
        "address":"909 S Dinwiddie St Arlington VA 22204",
        "latitude":38.8563787,
        "longitude":-77.1121926747,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":13.1428659061,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"08:30",
            "close":"10:30"
          }
        },
        "specialNotes":"Full Choice"
      },
      {
        "name":"Hermosa Valley Mobile Home Park",
        "description":"",
        "address":"13950 Richmond Hwy Woodbridge VA 22191",
        "latitude":38.6510092857,
        "longitude":-77.2585019286,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":29.0805470915,
        "offersDelivery":false,
        "openingHours":{
          "1st thursday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Park Shirlington Apartments",
        "description":"",
        "address":"4500 31st St S Arlington VA 22206",
        "latitude":38.83748805,
        "longitude":-77.0928106377,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":13.418477468,
        "offersDelivery":false,
        "openingHours":{
          "1st wednesday of the month":{
            "open":"14:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"THEARC Farm",
        "description":"Pre-bagged or boxed groceries",
        "address":"1801 Mississippi Ave SE Washington DC DC 20020",
        "latitude":38.8437130975,
        "longitude":-76.9773535612,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.3085234036,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"12:00",
            "close":"15:00"
          }
        },
        "specialNotes":"Full Choice"
      },
      {
        "name":"So Others Might Eat",
        "description":"Prepared meals",
        "address":"71 O ST NW Washington DC 20002",
        "latitude":38.9089563,
        "longitude":-77.0114316241,
        "contactPhone":"(202) 235-1472",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":6.8394949592,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Not open to public."
      },
      {
        "name":"So Others Might Eat",
        "description":"Loose groceries",
        "address":"71 O ST NW Washington DC 20002",
        "latitude":38.9089563,
        "longitude":-77.0114316241,
        "contactPhone":"(202) 235-1472",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.8394949592,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"11:00"
          },
          "tuesday":{
            "open":"09:00",
            "close":"11:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"11:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"11:00"
          },
          "friday":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Community Family Life Services",
        "description":"Pre-bagged or boxed groceries",
        "address":"305 E Street NW Washington DC 20001",
        "latitude":38.89621,
        "longitude":-77.0153695921,
        "contactPhone":"(202) 347-0511",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":7.6878672111,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Bread for the City SE Center",
        "description":"Loose groceries",
        "address":"1700 Marion Barry Ave SE Washington DC 20020",
        "latitude":38.86634,
        "longitude":-76.98038,
        "contactPhone":"(202) 773-2308",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.8253802393,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"15:00"
          },
          "tuesday":{
            "open":"09:00",
            "close":"15:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"15:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":"DC Residents Only"
      },
      {
        "name":"Bread For The City NW Center",
        "description":"Loose groceries",
        "address":"1525 7th St. NW Washington DC 20001",
        "latitude":38.91032075,
        "longitude":-77.021590384,
        "contactPhone":"(202) 773-2308",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":7.0959749299,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"15:00"
          },
          "tuesday":{
            "open":"09:00",
            "close":"15:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"15:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":"DC Residents Only"
      },
      {
        "name":"DC University Food Pantry GWU",
        "description":"Loose groceries",
        "address":"800 21st Street NW Washington DC 20052",
        "latitude":38.8999,
        "longitude":-77.0472,
        "contactPhone":"(202) 994-9192",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.5474930025,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"12:00",
            "close":"18:00"
          },
          "tuesday":{
            "open":"12:00",
            "close":"18:00"
          },
          "wednesday":{
            "open":"12:00",
            "close":"18:00"
          },
          "thursday":{
            "open":"12:00",
            "close":"18:00"
          },
          "friday":{
            "open":"14:00",
            "close":"20:00"
          }
        },
        "specialNotes":"Members of the George Washington Univ. community only."
      },
      {
        "name":"Ward 7 Food Center of Peace Lutheran Church",
        "description":"Loose groceries",
        "address":"4929 Ames St NE Washington DC 20019",
        "latitude":38.89065,
        "longitude":-76.93169,
        "contactPhone":"(301) 367-6983",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.8516428247,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"11:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Grab n Go"
      },
      {
        "name":"Metropolitan Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"1200 Mercantile Lane Suite 115B Largo MD 20774",
        "latitude":38.90686,
        "longitude":-76.83885,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":7.8123696898,
        "offersDelivery":true,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Purity Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1325 Maryland Ave NE Washington DC 20002",
        "latitude":38.8981599,
        "longitude":-76.9872556036,
        "contactPhone":"(202) 397-4333",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.860566633,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"10:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"SevaTruck Foundation",
        "description":"Prepared meals",
        "address":"2815 Old Lee Hwy Fairfax Fairfax VA 22031",
        "latitude":38.8757888053,
        "longitude":-77.2392202721,
        "contactPhone":"(202) 550-3018",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":18.0111567749,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"15:00",
            "close":"17:00"
          },
          "tuesday":{
            "open":"15:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"15:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"15:00",
            "close":"17:00"
          }
        },
        "specialNotes":"Braddock ES-7825 Heritage Dr, Annandale, VA 22003"
      },
      {
        "name":"Interfaith Community Action Council - Oxon Hill Food Pantry",
        "description":"Loose groceries",
        "address":"4915 Saint Barnabas Road Temple Hills MD 20748",
        "latitude":38.8219741,
        "longitude":-76.9565648858,
        "contactPhone":"(301) 899-8358",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":11.6327061213,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Agape Early Childhood Learning",
        "description":"Pre-bagged or boxed groceries",
        "address":"4318 Rhode Island Avenue Brentwood MD 20722",
        "latitude":38.9409284088,
        "longitude":-76.9527761367,
        "contactPhone":"(301) 927-4674",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":3.464542781,
        "offersDelivery":false,
        "openingHours":{
          "4th wednesday of the month":{
            "open":"15:00",
            "close":"17:30"
          }
        },
        "specialNotes":"Appointments open to parents, staff, and referred families"
      },
      {
        "name":"Spanish Catholic Center",
        "description":"Loose groceries",
        "address":"1618 Monroe St. NW Washington DC 20010",
        "latitude":38.93271405,
        "longitude":-77.0373982767,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":6.6434955844,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"16:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"16:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"16:00"
          },
          "4th wednesday of the month":{
            "open":"10:00",
            "close":"11:30"
          },
          "thursday":{
            "open":"10:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Central Union Mission",
        "description":"Prepared meals",
        "address":"65 Massachusetts Ave Washington DC 20001",
        "latitude":38.89868405,
        "longitude":-77.0110822499,
        "contactPhone":"(202) 718-0549",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":7.4199572957,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"12:30",
            "close":"18:00"
          },
          "tuesday":{
            "open":"12:30",
            "close":"18:00"
          },
          "wednesday":{
            "open":"12:30",
            "close":"18:00"
          },
          "thursday":{
            "open":"12:30",
            "close":"18:00"
          },
          "friday":{
            "open":"12:30",
            "close":"18:00"
          }
        },
        "specialNotes":"We serve Breakfast -Lunch-Dinner"
      },
      {
        "name":"The Father McKenna Center",
        "description":"Loose groceries",
        "address":"900 North Capital St NW Washington DC DC 20002",
        "latitude":38.90187,
        "longitude":-77.00953,
        "contactPhone":"(202) 842-1112",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.1892189273,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"13:30",
            "close":"14:30"
          },
          "tuesday":{
            "open":"13:30",
            "close":"14:30"
          },
          "thursday":{
            "open":"13:30",
            "close":"14:30"
          },
          "friday":{
            "open":"13:30",
            "close":"14:30"
          }
        },
        "specialNotes":"To use our full pantry, we require that in an addition to a photo ID that our visitors provide us with a copy of a proof of residence in DC. This can be a current lease, or a recent utility bill, rent receipt, mortgage, or deed."
      },
      {
        "name":"Miriam's Kitchen",
        "description":"Prepared meals",
        "address":"2401 Virginia Ave NW Washington DC 20037",
        "latitude":38.898593,
        "longitude":-77.0516915247,
        "contactPhone":"(240) 350-1058",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":8.779824782,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"16:00",
            "close":"17:00"
          },
          "tuesday":{
            "open":"16:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"16:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"16:00",
            "close":"17:00"
          },
          "friday":{
            "open":"16:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mount Rainier Seventh Day Adventist Spanish Church",
        "description":"Loose groceries",
        "address":"6012 Ager Road Hyattsville MD 20782",
        "latitude":38.9542534204,
        "longitude":-76.9652870101,
        "contactPhone":"(240) 346-9272",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.8598041475,
        "offersDelivery":true,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"19:00",
            "close":"21:00"
          },
          "2nd saturday of the month":{
            "open":"14:30",
            "close":"17:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Emmanuel Worship Center Seventh Day Adventist Church",
        "description":"Loose groceries",
        "address":"8145 Richmond Highway Alexandria VA 22309",
        "latitude":38.7926155834,
        "longitude":-77.0567369681,
        "contactPhone":"(301) 793-8578",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":15.0447653223,
        "offersDelivery":true,
        "openingHours":{
          "1st and 3rd saturday of the month":{
            "open":"14:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"ACTS",
        "description":"Loose groceries",
        "address":"3901 ACTS Lane Dumfries VA 22026",
        "latitude":38.5644141327,
        "longitude":-77.3289089183,
        "contactPhone":"(703) 441-8606",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":36.1563003678,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"13:00",
            "close":"15:00"
          },
          "tuesday":{
            "open":"17:00",
            "close":"19:00"
          },
          "thursday":{
            "open":"13:00",
            "close":"15:00"
          }
        },
        "specialNotes":"Service Area: 22025, 22026, 22125, 22134, 22135, 22172, 22191, 22192, 22193"
      },
      {
        "name":"National City Christian Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"5 Thomas Circle NW Washington DC 20005",
        "latitude":38.9064998,
        "longitude":-77.0327273121,
        "contactPhone":"(202) 232-0323",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":7.6854924649,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":"Distribution will be on Tuesday if the Wednesday is a holiday.   This year we will distribute on 12/24 and 12/31."
      },
      {
        "name":"Good Samaritan Ministry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1417 Chillum Rd Hyattsville MD 20782",
        "latitude":38.959575,
        "longitude":-76.98351485,
        "contactPhone":"(240) 478-0975",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":3.2190699987,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Brighter Day Ministries Food Pantry",
        "description":"Loose groceries",
        "address":"3209 5th Street SE Washington DC 20032",
        "latitude":38.84261695,
        "longitude":-76.9997497795,
        "contactPhone":"(301) 806-4305",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.6943637387,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Food For Others",
        "description":"Loose groceries",
        "address":"2938 Prosperity Avenue Fairfax VA 22031",
        "latitude":38.8721204113,
        "longitude":-77.2368593813,
        "contactPhone":"(703) 207-9173",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":18.010383041,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"09:30",
            "close":"17:00"
          },
          "wednesday":{
            "open":"09:30",
            "close":"17:00"
          },
          "thursday":{
            "open":"09:30",
            "close":"17:00"
          }
        },
        "specialNotes":"We ask for ID or a piece of mail  to verify Virginia residency. Please check our website for Holiday Closings."
      },
      {
        "name":"Food For Others",
        "description":"Loose groceries",
        "address":"2938 Prosperity Avenue Fairfax VA 22031",
        "latitude":38.8721204113,
        "longitude":-77.2368593813,
        "contactPhone":"(703) 207-9173",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":18.010383041,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"09:30",
            "close":"17:00"
          }
        },
        "specialNotes":"We ask for ID or a piece of mail  to verify Virginia residency. Please check our website for Holiday Closings."
      },
      {
        "name":"Damien Ministries Food Pantry",
        "description":"Loose groceries",
        "address":"2200 Rhode Island AVE NE Washington DC 20018",
        "latitude":38.9304186,
        "longitude":-76.9739515925,
        "contactPhone":"(202) 526-3020",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.5331770311,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:30",
            "close":"15:30"
          },
          "tuesday":{
            "open":"09:30",
            "close":"15:30"
          },
          "wednesday":{
            "open":"09:30",
            "close":"15:30"
          },
          "thursday":{
            "open":"09:30",
            "close":"15:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Covenant Baptist Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3845 South Capitol St SW Washington DC 20032",
        "latitude":38.8341748,
        "longitude":-77.0089621313,
        "contactPhone":"(202) 438-7532",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":11.4066282724,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"09:30",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Nineteenth Street Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4606 16th St NW Washington DC 20011",
        "latitude":38.94684,
        "longitude":-77.03691,
        "contactPhone":"(202) 829-2773",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.0923719993,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th thursday of the month":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Faith United Ministries Outreach",
        "description":"Pre-bagged or boxed groceries",
        "address":"7905 Fernham Lane District Heights MD 20747",
        "latitude":38.84611,
        "longitude":-76.86846,
        "contactPhone":"(301) 736-2383",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.5983812175,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"08:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First Baptist Church of Capitol Heights",
        "description":"Pre-bagged or boxed groceries",
        "address":"6 Capitol Heights Blvd Capitol Heights MD 20743",
        "latitude":38.88520755,
        "longitude":-76.9138747952,
        "contactPhone":"(301) 336-0722",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.3334183419,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"13:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Assumption Outreach",
        "description":"Pre-bagged or boxed groceries",
        "address":"220 Highview Place SE  Washington DC 20032",
        "latitude":38.84150505,
        "longitude":-77.0045613668,
        "contactPhone":"(202) 561-5941",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.8502014238,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"12:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"12:00"
          },
          "friday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Cornerstones, Inc.",
        "description":"Loose groceries",
        "address":"11484 Washington Plz W  #120 Reston VA 20190",
        "latitude":38.96862,
        "longitude":-77.34277,
        "contactPhone":"(571) 323-1410",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":21.8004432788,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"08:30",
            "close":"16:30"
          },
          "tuesday":{
            "open":"08:30",
            "close":"16:30"
          },
          "wednesday":{
            "open":"08:30",
            "close":"16:30"
          },
          "thursday":{
            "open":"08:30",
            "close":"16:30"
          },
          "friday":{
            "open":"08:30",
            "close":"13:30"
          },
          "1st saturday of the month":{
            "open":"09:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"MSB Outreach House",
        "description":"Loose groceries",
        "address":"2411 Lawrence St NE Washington DC 20018",
        "latitude":38.9319534,
        "longitude":-76.9715324692,
        "contactPhone":"(202) 526-3685",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.3822541722,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"09:00",
            "close":"14:00"
          },
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Ward Five residents only"
      },
      {
        "name":"Atonement Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"5073 East Capitol Street SE Washington DC 20019",
        "latitude":38.88946475,
        "longitude":-76.9273466296,
        "contactPhone":"(202) 251-7725",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.9484114633,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"10:00",
            "close":"13:00"
          },
          "1st wednesday of the month":{
            "open":"16:00",
            "close":"19:00"
          },
          "4th saturday of the month":{
            "open":"09:00",
            "close":"13:00"
          }
        },
        "specialNotes":"Fresh Produce (first come, first served), non-perishables, and meat (if available)"
      },
      {
        "name":"Dupont Park SDA Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3942 Alabama Ave SE Washington DC 20019",
        "latitude":38.86964565,
        "longitude":-76.9480238917,
        "contactPhone":"(301) 980-6274",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":8.3132292282,
        "offersDelivery":false,
        "openingHours":{
          "1st, 2nd, and 4th tuesday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Metropolitan SDA Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"6303 Riggs Rd Hyattsville MD 20783",
        "latitude":38.96612,
        "longitude":-76.98619,
        "contactPhone":"(301) 853-2224",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.0675891229,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Sixth Church Food Closet",
        "description":"Loose groceries",
        "address":"5413 16th St  NW Washington DC 20011",
        "latitude":38.95594,
        "longitude":-77.03593,
        "contactPhone":"(202) 723-5377",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.7642844105,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th wednesday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":"No food pantry requirement"
      },
      {
        "name":"Columbia Baptist Church",
        "description":"Loose groceries",
        "address":"3245 Glen Carlyn Rd. Falls Church VA 22041",
        "latitude":38.85761,
        "longitude":-77.13846,
        "contactPhone":"(571) 422-2075",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":14.1293844158,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"10:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Salvation Army - Solomon G Brown",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"2300 Martin Luther King Ave SE Washington DC 20020",
        "latitude":38.86299,
        "longitude":-76.99123,
        "contactPhone":"(202) 678-9770 or9771",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":9.2139410411,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"09:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Salvation Army - Solomon G Brown",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"2300 Martin Luther King Ave SE Washington DC 20020",
        "latitude":38.86299,
        "longitude":-76.99123,
        "contactPhone":"(202) 678-9770 or9771",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":9.2139410411,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"09:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Closed for lunch from 12-12:30pm"
      },
      {
        "name":"The Salvation Army - Sherman Ave",
        "description":"Pre-bagged or boxed groceries",
        "address":"3335 Sherman Ave. NW Washington DC 20010",
        "latitude":38.9315816,
        "longitude":-77.0263815,
        "contactPhone":"(202) 829-0100",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.2269337053,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"09:30",
            "close":"13:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Arlington Bridge Builders",
        "description":"Loose groceries",
        "address":"790 South Carlin Springs Road Arlington VA 22204",
        "latitude":38.8570867837,
        "longitude":-77.1260739143,
        "contactPhone":"(571) 282-5156",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":13.6521673908,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"15:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"15:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Church of Christ of Dale City",
        "description":"Pre-bagged or boxed groceries",
        "address":"13130 Hillendale Drive Dale City VA 22193",
        "latitude":38.66643,
        "longitude":-77.33503,
        "contactPhone":"(703) 346-4991",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":30.9202563827,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th monday of the month":{
            "open":"15:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Food For All",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1810 16th St NW Washington DC 20009",
        "latitude":38.9143737,
        "longitude":-77.0369512989,
        "contactPhone":"(240) 410-0024",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":7.4479378454,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"08:00",
            "close":"13:00"
          },
          "friday":{
            "open":"07:30",
            "close":"13:00"
          },
          "saturday":{
            "open":"08:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Grace Episcopal Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"3601 Russell Road Alexandria VA 22305",
        "latitude":38.83727545,
        "longitude":-77.0648157885,
        "contactPhone":"(703) 549-1980",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":12.5516930756,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"18:00",
            "close":"19:30"
          },
          "friday":{
            "open":"18:00",
            "close":"19:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"United Community Ministry",
        "description":"Loose groceries",
        "address":"7511 Fordson Road Alexandria VA 22306",
        "latitude":38.75378,
        "longitude":-77.08512,
        "contactPhone":"(703) 768-7106",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":18.1249827345,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"14:00",
            "close":"17:00"
          }
        },
        "specialNotes":"22303, 22306, 22307, 23308, 22309, 22310. We are not currently accepting new clients at this time."
      },
      {
        "name":"United Community Ministry",
        "description":"Loose groceries",
        "address":"7511 Fordson Road Alexandria VA 22306",
        "latitude":38.75378,
        "longitude":-77.08512,
        "contactPhone":"(703) 768-7106",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":18.1249827345,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"13:00"
          },
          "tuesday":{
            "open":"12:00",
            "close":"15:00"
          },
          "thursday":{
            "open":"12:00",
            "close":"15:00"
          },
          "4th saturday of the month":{
            "open":"08:00",
            "close":"11:00"
          }
        },
        "specialNotes":"22303, 22306, 22307, 23308, 22309, 22310. We are not currently accepting new clients at this time."
      },
      {
        "name":"Fort Foote Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"8310 Ft Foote Road Fort Washington MD 20744",
        "latitude":38.77445,
        "longitude":-77.01391,
        "contactPhone":"(240) 281-2303",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":15.425596839,
        "offersDelivery":true,
        "openingHours":{
          "4th saturday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Our Lady of Perpetual Help Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1600 Morris Rd SE Washington DC 20020",
        "latitude":38.8578053,
        "longitude":-76.9815059718,
        "contactPhone":"(202) 678-4999",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":9.4111076858,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"10:30",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mount Moriah Baptist Church",
        "description":"Loose groceries",
        "address":"1636 East Capitol Street SE Washington DC 20003",
        "latitude":38.89012,
        "longitude":-76.98104,
        "contactPhone":"(410) 271-5656",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":7.2622159504,
        "offersDelivery":false,
        "openingHours":{
          "4th wednesday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Paramount Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3924 4th St SE Washington DC 20032",
        "latitude":38.8321095,
        "longitude":-77.0002639554,
        "contactPhone":"(202) 562-6339",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":11.3946984155,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"North Capitol Collaborative, Inc.",
        "description":"Pre-bagged or boxed groceries",
        "address":"3230 Pennsylvania Ave SE #202 Washington DC 20020",
        "latitude":38.86962,
        "longitude":-76.95956,
        "contactPhone":"(202) 588-1800",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.3788508948,
        "offersDelivery":true,
        "openingHours":{
          "2nd and 4th thursday of the month":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Must be a DC Resident"
      },
      {
        "name":"Fort Washington Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9801 Livingston Road Fort Washington MD 20744",
        "latitude":38.7556609,
        "longitude":-77.0009664216,
        "contactPhone":"(202) 679-8898",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":16.5238553108,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Walker Mill Community Development Center",
        "description":"Loose groceries",
        "address":"6801 Walker Mill Rd Capitol Heights MD 20743",
        "latitude":38.8686339,
        "longitude":-76.8906355,
        "contactPhone":"(240) 350-4056",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":8.7406574966,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"12:30"
          }
        },
        "specialNotes":"Please enter side door and bring own bags"
      },
      {
        "name":"ISKCON of Washington",
        "description":"Prepared meals",
        "address":"10310 Oaklyn Dr Potomac MD 20854",
        "latitude":39.00234,
        "longitude":-77.21416,
        "contactPhone":"(240) 277-2221",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":14.8659857709,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"18:00",
            "close":"19:00"
          },
          "tuesday":{
            "open":"18:00",
            "close":"19:00"
          },
          "wednesday":{
            "open":"18:00",
            "close":"19:00"
          },
          "thursday":{
            "open":"18:00",
            "close":"19:00"
          },
          "friday":{
            "open":"18:00",
            "close":"19:00"
          },
          "saturday":{
            "open":"13:00",
            "close":"19:00"
          },
          "sunday":{
            "open":"14:00",
            "close":"19:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"WFCM Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4511 Daly Dr Suite J Chantilly VA 20151",
        "latitude":38.88383,
        "longitude":-77.44306,
        "contactPhone":"(703) 988-9656",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":28.1227342463,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"16:30",
            "close":"19:00"
          },
          "tuesday":{
            "open":"16:30",
            "close":"19:00"
          },
          "wednesday":{
            "open":"10:30",
            "close":"14:00"
          },
          "thursday":{
            "open":"16:30",
            "close":"19:00"
          },
          "friday":{
            "open":"10:30",
            "close":"14:00"
          },
          "2nd saturday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Greater Refuge Ministries",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9512 Piscataway Road Clinton MD 20735",
        "latitude":38.7409426707,
        "longitude":-76.9393444818,
        "contactPhone":"(301) 856-8806",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":17.1878632432,
        "offersDelivery":false,
        "openingHours":{
          "3rd friday of the month":{
            "open":"08:30",
            "close":"10:30"
          }
        },
        "specialNotes":"Appointments can be made by calling Jim"
      },
      {
        "name":"St. Michael and All Angels",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"8501 New Hampshire Ave  Adelphi MD  20783",
        "latitude":38.9977788733,
        "longitude":-76.9838527559,
        "contactPhone":"(240) 882-0274",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.5352904676,
        "offersDelivery":true,
        "openingHours":{
          "3rd friday of the month":{
            "open":"09:30",
            "close":"11:30"
          },
          "3rd saturday of the month":{
            "open":"14:00",
            "close":"18:00"
          }
        },
        "specialNotes":"Please note that distribution on the 3rd Friday of each month is by appointment only."
      },
      {
        "name":"City of Praise Family Ministries",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"8806 Brightseat Road Landover MD 20785",
        "latitude":38.9160198873,
        "longitude":-76.8603178659,
        "contactPhone":"(301) 404-8234",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":6.5764459535,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"16:30",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Ebenezer Church of God",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7550 Buchanan St. Hyattsville MD 20784",
        "latitude":38.9476175379,
        "longitude":-76.9396526579,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.9093524078,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Washington Spanish SDA Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"12604 New Hampshire Avenue Silver Spring MD 20904",
        "latitude":39.07574585,
        "longitude":-77.00205455,
        "contactPhone":"(240) 638-7086",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":6.8730742919,
        "offersDelivery":true,
        "openingHours":{
          "1st and 3rd tuesday of the month":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":"Everybody is welcome."
      },
      {
        "name":"Gethsemane United Methodist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"910 Addison Road Capitol Heights MD 20743",
        "latitude":38.8705088867,
        "longitude":-76.8941349564,
        "contactPhone":"(301) 237-7116",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.5632977084,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Bread & Fishes",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3890 Cameron Street Dumfries Va 22026",
        "latitude":38.5686421837,
        "longitude":-77.3287835102,
        "contactPhone":"(240) 778-3764",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":35.9149568445,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"17:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Northeastern Presbyterian Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"2112 Varnum St. NE Washington DC 20018",
        "latitude":38.9433381,
        "longitude":-76.9753573343,
        "contactPhone":"(202) 316-8744",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":3.7857912975,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Urban Outreach Inc.",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"5343 C St SE  Suite 204 Washington DC 20019",
        "latitude":38.8843,
        "longitude":-76.92458,
        "contactPhone":"(202) 575-4867",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":7.3170940359,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"08:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"LINK Mobile Food Pantry - Christ the Redeemer",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"46833 Harry Byrd Highway, Sterling VA 20164",
        "latitude":39.01752845,
        "longitude":-77.3797118864,
        "contactPhone":"(703) 973-4444",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":23.8055302743,
        "offersDelivery":true,
        "openingHours":{
          "nan":{
            "open":"09:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Southern Friendship Missionary Baptist Church",
        "description":"Loose groceries",
        "address":"4444 Branch Avenue Temple Hills MD 20748",
        "latitude":38.83148,
        "longitude":-76.93091,
        "contactPhone":"(301) 523-6090",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.9383418964,
        "offersDelivery":false,
        "openingHours":{
          "1st and 3rd tuesday of the month":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Faith Temple #2",
        "description":"Pre-bagged or boxed groceries",
        "address":"211 Maryland Park Dr Capitol Heights MD 20743",
        "latitude":38.89148,
        "longitude":-76.90921,
        "contactPhone":"(301) 655-1722",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.9581777872,
        "offersDelivery":true,
        "openingHours":{
          "1st tuesday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":"We are open for anyone needing food on the 1st Tuesday of each month."
      },
      {
        "name":"Bethlehem Baptist Church",
        "description":"Loose groceries",
        "address":"7836 Fordson Road Alexandria VA 22306",
        "latitude":38.74377,
        "longitude":-76.08161,
        "contactPhone":"(703) 867-6049",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":49.0947411276,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Greater Fellowship Missionary Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"814 Alabama Ave SE Washington DC 20032",
        "latitude":38.8440468,
        "longitude":-76.993877165,
        "contactPhone":"(202) 413-4462",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.5056069091,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"09:00",
            "close":"10:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"ECD - Overlook at Oxon Run",
        "description":"",
        "address":"3700 9th st SE Washington DC 20032",
        "latitude":38.8358957,
        "longitude":-76.9942616312,
        "contactPhone":"(202) 528-0489",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":11.0520024377,
        "offersDelivery":true,
        "openingHours":{
          "3rd wednesday of the month":{
            "open":"10:00",
            "close":"13:00"
          },
          "1st wednesday of the month":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"ECD - Overlook at Oxon Run",
        "description":"",
        "address":"3700 9th st SE Washington DC 20032",
        "latitude":38.8358957,
        "longitude":-76.9942616312,
        "contactPhone":"(202) 528-0489",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":11.0520024377,
        "offersDelivery":false,
        "openingHours":{
          "1st thursday of the month":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Freedom Way Missionary Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"1266 Benning Road Capitol Heights MD 20743",
        "latitude":38.87347325,
        "longitude":-76.9285802916,
        "contactPhone":"(301) 807-6912",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":8.0458566433,
        "offersDelivery":false,
        "openingHours":{
          "nan":{
            "open":"13:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Joseph Catholic Church",
        "description":"Loose groceries",
        "address":"2020 St Joseph Drive  Largo MD 20774",
        "latitude":38.91809,
        "longitude":-76.84369,
        "contactPhone":"(301) 773-0102",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.0746449861,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"11:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Emergency food is available after hours. Must call to arrange a pickup at 301-773-4838, ext. 13."
      },
      {
        "name":"Prince George's County DSS",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"805 Brightseat Rd Landover MD 20785",
        "latitude":38.9160198873,
        "longitude":-76.8603178659,
        "contactPhone":"(301) 909-6364",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":6.5764459535,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"08:30",
            "close":"16:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Prince George's County DSS",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"805 Brightseat Rd Landover MD 20785",
        "latitude":38.9160198873,
        "longitude":-76.8603178659,
        "contactPhone":"(301) 909-6364",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.5764459535,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"08:30",
            "close":"16:30"
          },
          "wednesday":{
            "open":"08:30",
            "close":"16:30"
          },
          "thursday":{
            "open":"08:30",
            "close":"16:30"
          },
          "friday":{
            "open":"08:30",
            "close":"16:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Paul UMC",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"6634 St. Barnabas Road Oxon Hill  MD 20745",
        "latitude":38.7980724,
        "longitude":-76.9823047834,
        "contactPhone":"2 (440) 460-3401",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":13.4549038139,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"13:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Margaret of Scotland Catholic Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"408 Addison Road, South Capitol Heights MD 20743",
        "latitude":38.88354,
        "longitude":-76.89629,
        "contactPhone":"(301) 336-3344",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.6667901117,
        "offersDelivery":false,
        "openingHours":{
          "1st, 2nd, and 3rd saturday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"FISH of Laurel, Inc.",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"308 Gorman Ave Laurel  MD 20707",
        "latitude":39.0984608,
        "longitude":-76.8506113797,
        "contactPhone":"(240) 460-5667",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.8522372902,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"10:00",
            "close":"12:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"12:30"
          }
        },
        "specialNotes":"We open at 10:15 AM."
      },
      {
        "name":"Life Builders",
        "description":"Pre-bagged or boxed groceries",
        "address":"6608 Wilkins Place Forestville MD 20747",
        "latitude":38.840773,
        "longitude":-76.8932991237,
        "contactPhone":"(301) 785-2543",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.5644271068,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th tuesday of the month":{
            "open":"10:00",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Shepherd's Table - Progress Place Building",
        "description":"Prepared meals",
        "address":"8106 Georgia Avenue Silver Springs MD 20910",
        "latitude":38.99083,
        "longitude":-77.02755,
        "contactPhone":"(301) 585-6463",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.820528766,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"06:00",
            "close":"19:00"
          },
          "tuesday":{
            "open":"06:00",
            "close":"19:00"
          },
          "wednesday":{
            "open":"06:00",
            "close":"19:00"
          },
          "thursday":{
            "open":"06:00",
            "close":"19:00"
          },
          "friday":{
            "open":"06:00",
            "close":"19:00"
          },
          "saturday":{
            "open":"07:30",
            "close":"19:00"
          },
          "sunday":{
            "open":"07:30",
            "close":"19:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Rainbow Community Development Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"2120 Industrial Parkway A Silver Spring MD 20904",
        "latitude":39.05471,
        "longitude":-76.96907,
        "contactPhone":"(301) 625-2561",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":4.7951923881,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"09:00",
            "close":"12:00"
          },
          "4th saturday of the month":{
            "open":"09:00",
            "close":"11:00"
          },
          "2nd saturday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":"Tuesday and Thursday are by appointment only in zip codes 20901, 20903, 20904, 20905, 20906, 20866, 20868.  Saturdays are open to all MoCo zip codes..  First time clients call 301-625-2561"
      },
      {
        "name":"Community Support Systems Inc BADEN",
        "description":"Pre-bagged or boxed groceries",
        "address":"13500 Baden Westwood Road Brandywine MD 20613",
        "latitude":38.66047,
        "longitude":-76.77234,
        "contactPhone":"(301) 372-1491",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":24.4292777829,
        "offersDelivery":true,
        "openingHours":{
          "friday":{
            "open":"09:30",
            "close":"11:00"
          }
        },
        "specialNotes":"Closed Friday 12/27"
      },
      {
        "name":"Edward C Mazique Child Care Center",
        "description":"Loose groceries",
        "address":"1719 13th St NW Washington DC 20009",
        "latitude":38.91327205,
        "longitude":-77.0292766,
        "contactPhone":"(202) 462-3375",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.2143107747,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"12:00",
            "close":"17:00"
          },
          "tuesday":{
            "open":"12:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"12:00",
            "close":"16:00"
          },
          "thursday":{
            "open":"12:00",
            "close":"17:00"
          },
          "friday":{
            "open":"12:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Church of the Incarnation, St. Vincent De Paul Society",
        "description":"Pre-bagged or boxed groceries",
        "address":"880 Eastern Ave  NE Washington DC 20019",
        "latitude":38.9070891319,
        "longitude":-76.9275424201,
        "contactPhone":"(301) 728-3134",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":5.7344748319,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Shabach Emergency Empowerment Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"403 Brightseat Rd Landover MD 20785",
        "latitude":38.9160198873,
        "longitude":-76.8603178659,
        "contactPhone":"(301) 237-6353",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.5764459535,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Shabach Emergency Empowerment Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"403 Brightseat Rd Landover MD 20785",
        "latitude":38.9160198873,
        "longitude":-76.8603178659,
        "contactPhone":"(301) 237-6353",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":6.5764459535,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Shabach Emergency Empowerment Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"403 Brightseat Rd Landover MD 20785",
        "latitude":38.9160198873,
        "longitude":-76.8603178659,
        "contactPhone":"(301) 237-6353",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.5764459535,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"09:00",
            "close":"15:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"15:00"
          },
          "friday":{
            "open":"09:00",
            "close":"15:00"
          },
          "3rd saturday of the month":{
            "open":"09:30",
            "close":"14:30"
          }
        },
        "specialNotes":"evite to junior and high schools"
      },
      {
        "name":"Victory Drug Center",
        "description":"Pre-bagged or boxed groceries",
        "address":"1804 Quarter Avenue Capitol Heights MD 20743",
        "latitude":38.86534,
        "longitude":-76.92365,
        "contactPhone":"(301) 735-2222",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":8.6261376323,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"09:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Saint Benedict The Moor",
        "description":"Pre-bagged or boxed groceries",
        "address":"320 21st Street NE Washington DC 20002",
        "latitude":38.8942259,
        "longitude":-76.9754575,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":6.9001342549,
        "offersDelivery":false,
        "openingHours":{
          "3rd monday of the month":{
            "open":"09:30",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Capital Christian Fellowship",
        "description":"Loose groceries",
        "address":"10411 Greenbelt Rd  Lanham MD 20706",
        "latitude":38.98888,
        "longitude":-76.82493,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.0618713756,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"13:00"
          },
          "sunday":{
            "open":"12:00",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Paul United Methodist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1400 G St Woodbridge  VA 22191",
        "latitude":38.6606663488,
        "longitude":-77.2529183813,
        "contactPhone":"(703) 568-5694",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":28.3648995963,
        "offersDelivery":false,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"14:30",
            "close":"17:30"
          },
          "1st saturday of the month":{
            "open":"07:30",
            "close":"10:30"
          }
        },
        "specialNotes":"Income requirement is only to receive TEFAP food"
      },
      {
        "name":"Greater New Hope Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"816 8th STREET NW Washington DC 20001",
        "latitude":38.900070583,
        "longitude":-77.0230481277,
        "contactPhone":"(301) 357-4905",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":7.7030960141,
        "offersDelivery":false,
        "openingHours":{
          "2nd tuesday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Divine Grace Mission",
        "description":"Pre-bagged or boxed groceries",
        "address":"4208 Glenn Dale Rd Bowie MD 20720",
        "latitude":38.94682,
        "longitude":-76.80098,
        "contactPhone":"(240) 460-0842",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.9246777967,
        "offersDelivery":true,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"10:30",
            "close":"14:00"
          },
          "1st saturday of the month":{
            "open":"10:30",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Corinth Baptist Church Outreach Program",
        "description":"Pre-bagged or boxed groceries",
        "address":"814 Cypress Tree Dr Capitol Heights MD 20743",
        "latitude":38.90215,
        "longitude":-76.90578,
        "contactPhone":"(202) 486-3963",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":6.2891464468,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":"All PG Residents Requesting Food, can call on other days besides Sat for food"
      },
      {
        "name":"Woodlawn United Methodist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7730 Fordson Road Alexandria VA 22306",
        "latitude":38.74692,
        "longitude":-77.08193,
        "contactPhone":"(703) 360-3050",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":18.4799257688,
        "offersDelivery":true,
        "openingHours":{
          "friday":{
            "open":"10:00",
            "close":"11:30"
          }
        },
        "specialNotes":"remainder of 2024 dates: 10/18, 11/1, 11/15, 12/20"
      },
      {
        "name":"Woodbridge Workers",
        "description":"Loose groceries",
        "address":"13950 Richmond Highway Woodbridge VA 22191",
        "latitude":38.65208,
        "longitude":-76.25979,
        "contactPhone":"(703) 969-0197",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":43.3162849123,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"11:30",
            "close":"12:30"
          },
          "friday":{
            "open":"11:30",
            "close":"12:30"
          },
          "saturday":{
            "open":"11:30",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Floris United Methodist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"13600 Frying Pan Road Herndon VA 20171",
        "latitude":38.94282,
        "longitude":-77.41688,
        "contactPhone":"(703) 798-5826",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":25.9400343309,
        "offersDelivery":false,
        "openingHours":{
          "1st saturday of the month":{
            "open":"08:00",
            "close":"09:00"
          }
        },
        "specialNotes":"Income requirement only applies to TEFAP pantry"
      },
      {
        "name":"Crowder Owens Calvary Food Bank (The Bishop Alfred A. Owens, Jr. Family Life CC)",
        "description":"Loose groceries",
        "address":"600 W Street NE Washington DC 20002",
        "latitude":38.91983055,
        "longitude":-76.9981465587,
        "contactPhone":"(202) 529-2299",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":5.8154005284,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"12:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"12:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"17:00",
            "close":"19:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Lord's Chosen Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1302 Cronson Blvd Crofton MD 21114",
        "latitude":39.0135649368,
        "longitude":-76.699514213,
        "contactPhone":"(301) 773-7573",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.9005566633,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"19:00",
            "close":"21:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Bull Run Unitarian Universalists",
        "description":"Loose groceries",
        "address":"9350 Main Street Manassas VA 20110",
        "latitude":38.75161105,
        "longitude":-77.4720402399,
        "contactPhone":"(703) 361-6269",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":33.1141461414,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th tuesday of the month":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Rising Hope Methodist Mission Church",
        "description":"Loose groceries",
        "address":"8220 Russell Road Alexandria VA 22309",
        "latitude":38.8078802961,
        "longitude":-77.0628123123,
        "contactPhone":"(719) 310-3277",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":14.2481407538,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"13:30",
            "close":"16:30"
          },
          "thursday":{
            "open":"13:30",
            "close":"16:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Anthony of Padua Catholic Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3305 Glen Carlyn Road Falls Church VA 22041",
        "latitude":38.85695,
        "longitude":-77.13899,
        "contactPhone":"(571) 471-3194",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":14.1806369438,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"13:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Women's Collective",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1818 New York Ave NE Washington DC 20020",
        "latitude":38.9176751,
        "longitude":-76.9767497622,
        "contactPhone":"(202) 483-7003",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.3986487731,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"17:00"
          },
          "tuesday":{
            "open":"09:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"17:00"
          },
          "friday":{
            "open":"09:00",
            "close":"17:00"
          }
        },
        "specialNotes":"Not open to public."
      },
      {
        "name":"First Baptist Church Ken-Gar",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3922 Hampden St Kensington MD 20895",
        "latitude":39.0315438,
        "longitude":-77.0797789731,
        "contactPhone":"(917) 364-1681",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.1524599947,
        "offersDelivery":true,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"13:00",
            "close":"14:30"
          },
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Galilee Community Development Corporation",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"2101 Shadyside Ave  Suitland MD  20746",
        "latitude":38.862301,
        "longitude":-76.932234,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":8.8076015094,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"12:00",
            "close":"14:30"
          },
          "2nd wednesday of the month":{
            "open":"12:00",
            "close":"14:30"
          },
          "thursday":{
            "open":"12:00",
            "close":"14:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Ebenezer We Care We Share Community",
        "description":"Loose groceries",
        "address":"6016 Princess Garden Parkway New Carrollton MD 20784",
        "latitude":38.9647,
        "longitude":-76.86554,
        "contactPhone":"(301) 577-7436",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.2483553205,
        "offersDelivery":true,
        "openingHours":{
          "1st and 3rd saturday of the month":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Metropolis Club",
        "description":"Loose groceries",
        "address":"938 Rhode Island Ave NE Washington DC 20018",
        "latitude":38.92264025,
        "longitude":-76.9926335264,
        "contactPhone":"(301) 793-4236",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.4907778809,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"07:00",
            "close":"20:00"
          },
          "tuesday":{
            "open":"10:30",
            "close":"20:00"
          },
          "wednesday":{
            "open":"10:30",
            "close":"20:00"
          },
          "thursday":{
            "open":"10:30",
            "close":"20:00"
          },
          "friday":{
            "open":"10:30",
            "close":"20:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"20:00"
          },
          "sunday":{
            "open":"07:00",
            "close":"20:00"
          }
        },
        "specialNotes":"no requirement"
      },
      {
        "name":"Crossover Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"5340 Baltimore Ave Hyattsville MD 20781",
        "latitude":38.95513155,
        "longitude":-76.940885037,
        "contactPhone":"(301) 927-5620",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.3942178871,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"08:30",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Luther Rice Neighborhood Center",
        "description":"Pre-bagged or boxed groceries",
        "address":"801 University Blvd W Silver Spring MD 20901",
        "latitude":39.0412413777,
        "longitude":-77.0524082563,
        "contactPhone":"(301) 593-1130",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.1089843358,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Sydenstricker UMC",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"8508 Hooes Road Springfield VA 22153",
        "latitude":38.7563214,
        "longitude":-77.2394235,
        "contactPhone":"(571) 235-6048",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":22.87508845,
        "offersDelivery":false,
        "openingHours":{
          "4th tuesday of the month":{
            "open":"15:00",
            "close":"18:00"
          }
        },
        "specialNotes":"You must be in line by 6:00 p.m. to receive food."
      },
      {
        "name":"Sydenstricker UMC",
        "description":"Loose groceries",
        "address":"8508 Hooes Road Springfield VA 22153",
        "latitude":38.7563214,
        "longitude":-77.2394235,
        "contactPhone":"(571) 235-6048",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":22.87508845,
        "offersDelivery":false,
        "openingHours":{
          "2nd tuesday of the month":{
            "open":"15:00",
            "close":"18:00"
          }
        },
        "specialNotes":"You must be in line by 6:00 p.m. to receive food."
      },
      {
        "name":"Builders, Inc",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"5135 Marlboro Pike Capitol Heights MD 20743",
        "latitude":38.8723003695,
        "longitude":-76.9256476264,
        "contactPhone":"(202) 460-8011",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.1378763298,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"04:00",
            "close":"06:00"
          }
        },
        "specialNotes":"Distribution starts at 4 AM"
      },
      {
        "name":"Clothing of Power Eternal Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"25 Quire Ave Capitol Heights MD 20743",
        "latitude":38.88633715,
        "longitude":-76.9120974133,
        "contactPhone":"(240) 398-1681",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.274123226,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Early distribution before Christmas."
      },
      {
        "name":"National Baptist Memorial Church",
        "description":"Loose groceries",
        "address":"1501 Columbia Rd NW Washington DC 20009",
        "latitude":38.92705075,
        "longitude":-77.035988365,
        "contactPhone":"(202) 841-3742",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.8240649669,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Centreville UMC",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"6400 Old Centreville Rd Centreville VA 20121",
        "latitude":38.82568185,
        "longitude":-77.4397774315,
        "contactPhone":"(703) 830-2684",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":29.2720801362,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"07:30",
            "close":"09:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Paul's Lutheran Church",
        "description":"Loose groceries",
        "address":"4900 Connecticut Ave NW  Washington DC  20008",
        "latitude":38.954414,
        "longitude":-77.069584,
        "contactPhone":"(202) 966-5489",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.4871661922,
        "offersDelivery":false,
        "openingHours":{
          "1st and 3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"College Park Community Food Bank",
        "description":"Pre-bagged or boxed groceries",
        "address":"9704 Rhode Island Ave College Park MD 20740",
        "latitude":39.0120361224,
        "longitude":-76.921642051,
        "contactPhone":"(301) 364-4931",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":1.77045291,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"09:30",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Emmanuel UMC",
        "description":"Pre-bagged or boxed groceries",
        "address":"11416 Cedar Lane Beltsville MD 20705",
        "latitude":39.0423798761,
        "longitude":-76.9181753992,
        "contactPhone":"(301) 937-7114",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.7892692434,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"08:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Alexandria Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4725A Eisenhower Avenue ALEXANDRIA VA 22304",
        "latitude":38.80437745,
        "longitude":-77.10603285,
        "contactPhone":"(703) 719-8939",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":15.6780365399,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"09:00",
            "close":"13:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"13:00"
          }
        },
        "specialNotes":"Please arrive no later than 12:30 to allow processing. All clients require previous registration. All registrations are by appointment only and can be requested through AROPantry@ccda.net."
      },
      {
        "name":"St. Stephen's UMC",
        "description":"Pre-bagged or boxed groceries",
        "address":"9203 Braddock Rd  Burke  VA 22015",
        "latitude":38.80981,
        "longitude":-77.26279,
        "contactPhone":"(703) 978-8724",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":21.4447616788,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"07:00",
            "close":"09:00"
          }
        },
        "specialNotes":"Perishable/Non-perishable food, bread, diapers, household goods"
      },
      {
        "name":"Little David Baptist Church",
        "description":"Loose groceries",
        "address":"3103 Shepherd Street Mount Rainier MD 20712",
        "latitude":38.93954345,
        "longitude":-76.9636210958,
        "contactPhone":"(301) 927-5565",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.7328444585,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"11:00",
            "close":"13:00"
          },
          "sunday":{
            "open":"09:30",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Camillus Catholic Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"1600 Saint Camillus Drive  Silver Spring MD 20903",
        "latitude":39.0094437,
        "longitude":-76.9816625344,
        "contactPhone":"(301) 452-4233",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.7218088757,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"16:00",
            "close":"18:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Clients may visit the pantry once every 4 weeks."
      },
      {
        "name":"Fountain Community Enrichment Inc.",
        "description":"Pre-bagged or boxed groceries",
        "address":"15853 Commerce Court Upper Marlboro MD 20774",
        "latitude":38.88461,
        "longitude":-76.73073,
        "contactPhone":"(301) 335-5038",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":13.2880495918,
        "offersDelivery":false,
        "openingHours":{
          "3rd friday of the month":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Fountain Community Enrichment Inc.",
        "description":"Pre-bagged or boxed groceries",
        "address":"15853 Commerce Court Upper Marlboro MD 20774",
        "latitude":38.88461,
        "longitude":-76.73073,
        "contactPhone":"(301) 335-5038",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":13.2880495918,
        "offersDelivery":false,
        "openingHours":{
          "nan":{
            "open":null,
            "close":null
          }
        },
        "specialNotes":""
      },
      {
        "name":"Whosoever Will Christian Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4514 Sellman Road Beltsville MD 20705",
        "latitude":39.03579195,
        "longitude":-76.9137366099,
        "contactPhone":"(301) 257-2264",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.4367352959,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"16:30",
            "close":"18:30"
          },
          "nan":{
            "open":"As Needed",
            "close":"As Needed"
          }
        },
        "specialNotes":"Saturday is by appointment only. call 2408322991"
      },
      {
        "name":"Great Commission Change of Life Ministries",
        "description":"Pre-bagged or boxed groceries",
        "address":"7937 Penn Randall Place Unit A Upper Marlboro  MD 20772",
        "latitude":38.83346,
        "longitude":-76.86675,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":11.4511617875,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"10:30",
            "close":"13:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Faith Social Services",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"795 Center St #2A Herndon VA 20170",
        "latitude":38.97216,
        "longitude":-76.38557,
        "contactPhone":"(571) 345-4241",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":29.6853438092,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"11:00",
            "close":"14:00"
          },
          "friday":{
            "open":"11:00",
            "close":"14:00"
          },
          "saturday":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Hope Center",
        "description":"Pre-bagged or boxed groceries",
        "address":"4915 Wheeler Rd Oxon Hill MD 20745",
        "latitude":38.82170485,
        "longitude":-76.9688606252,
        "contactPhone":"(410) 877-4444",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":11.726999255,
        "offersDelivery":true,
        "openingHours":{
          "1st and 3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Can call to make an appointment for emergencies"
      },
      {
        "name":"Grace of God Ministry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3950 48th Street Bladensburg MD 20710",
        "latitude":38.9381376819,
        "longitude":-76.9361697404,
        "contactPhone":"(240) 274-2829",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":3.5637280785,
        "offersDelivery":false,
        "openingHours":{
          "4th thursday of the month":{
            "open":"15:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Fountain of Restoration Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"12304 Livingston Rd Fort Washington MD 20744",
        "latitude":38.720596,
        "longitude":-76.9852034688,
        "contactPhone":"(202) 213-4628",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":18.7676212099,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"12:00",
            "close":"16:00"
          }
        },
        "specialNotes":"We recdntly moved to a new location in Fort Washington. Our hours of operation may need adjustment once we are fully settled."
      },
      {
        "name":"Community Outreach and Development Center CDC",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4719 Marlboro Pike Capitol Heights MD 20743",
        "latitude":38.8737350364,
        "longitude":-76.9333421568,
        "contactPhone":"(301) 735-0121",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":8.0160757616,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"17:00"
          },
          "3rd and 4th tuesday of the month":{
            "open":"09:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"17:00"
          },
          "1st, 2nd, and 3rd friday of the month":{
            "open":"12:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Holiness Tabernacle Church of God",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"2193 Dale City VA 22195",
        "latitude":38.645601,
        "longitude":-77.3364973,
        "contactPhone":"(703) 497-7928",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":32.0303237139,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"09:30",
            "close":"10:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Maryland Umbrella Group",
        "description":"Pre-bagged or boxed groceries",
        "address":"408 Addison Road South Seat Pleasant MD 20743",
        "latitude":38.8858578932,
        "longitude":-76.8978438284,
        "contactPhone":"(301) 219-6650",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":7.4893315471,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"As Needed",
            "close":"As Needed"
          },
          "tuesday":{
            "open":"10:00",
            "close":"12:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"12:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Women Who Care Ministries",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"19640 Club House Road Suite 410 Montgomery Villlage MD 20886",
        "latitude":39.17402,
        "longitude":-77.20577,
        "contactPhone":"(301) 828-6850",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":19.2029569952,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"16:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"16:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Manna Food Center",
        "description":"Pre-bagged or boxed groceries",
        "address":"9311 Gaither Rd Gaithersburg MD 20877",
        "latitude":39.1185452,
        "longitude":-77.1920257,
        "contactPhone":"(240) 268-2539",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":16.2885389553,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"06:30",
            "close":"16:00"
          },
          "tuesday":{
            "open":"09:00",
            "close":"19:00"
          },
          "wednesday":{
            "open":"07:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"07:00",
            "close":"07:00"
          },
          "friday":{
            "open":"07:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Allen Chapel AME Church Outreach Ministry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"2518 Fairland Road Silver Spring MD 20904",
        "latitude":39.0772320604,
        "longitude":-76.9587795768,
        "contactPhone":"(301) 404-2688",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.1518724151,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"08:00",
            "close":"10:00"
          }
        },
        "specialNotes":"Montgomery & PG residents"
      },
      {
        "name":"Haymarket Regional Food Pantry",
        "description":"Loose groceries",
        "address":"7669 Limestone Drive Gainesville VA 20155",
        "latitude":38.79054,
        "longitude":-77.59805,
        "contactPhone":"(703) 795-4892",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":38.0809822329,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Haymarket Regional Food Pantry",
        "description":"Loose groceries",
        "address":"7669 Limestone Drive Gainesville VA 20155",
        "latitude":38.79054,
        "longitude":-77.59805,
        "contactPhone":"(703) 795-4892",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":38.0809822329,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"17:00",
            "close":"20:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Haymarket Regional Food Pantry",
        "description":"Loose groceries",
        "address":"7669 Limestone Drive Gainesville VA 20155",
        "latitude":38.79054,
        "longitude":-77.59805,
        "contactPhone":"(703) 795-4892",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":38.0809822329,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"17:00",
            "close":"20:30"
          },
          "wednesday":{
            "open":"17:00",
            "close":"20:30"
          },
          "thursday":{
            "open":"17:00",
            "close":"20:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Educare Support Services",
        "description":"Pre-bagged or boxed groceries",
        "address":"7001 New Hampshire Ave Takoma Park MD 20912",
        "latitude":38.976952,
        "longitude":-76.992273,
        "contactPhone":"(240) 450-2092",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.0553959247,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"As Needed",
            "close":"As Needed"
          },
          "tuesday":{
            "open":"As Needed",
            "close":"As Needed"
          },
          "wednesday":{
            "open":"As Needed",
            "close":"As Needed"
          },
          "thursday":{
            "open":"As Needed",
            "close":"As Needed"
          },
          "friday":{
            "open":"As Needed",
            "close":"As Needed"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Educare Support Services",
        "description":"Pre-bagged or boxed groceries",
        "address":"7001 New Hampshire Ave Takoma Park MD 20912",
        "latitude":38.976952,
        "longitude":-76.992273,
        "contactPhone":"(240) 450-2092",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.0553959247,
        "offersDelivery":true,
        "openingHours":{
          "1st saturday of the month":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":"3rd and 4th Saturdays - Offsite Deliveries Only"
      },
      {
        "name":"Gallaudet University Food Pantry",
        "description":"Pre-bagged or boxed groceries,Prepared meals",
        "address":"800 Florida Ave. NE Room Ely 100 Washington DC 20002",
        "latitude":38.90578,
        "longitude":-76.99492,
        "contactPhone":"(202) 651-5144",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.5606649057,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"17:00"
          },
          "tuesday":{
            "open":"09:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"17:00"
          },
          "friday":{
            "open":"09:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"River of Life Redeemed Christian Church of God",
        "description":"Pre-bagged or boxed groceries",
        "address":"5617 54th Ave. Riverdale MD 20737",
        "latitude":38.9590389,
        "longitude":-76.9226731015,
        "contactPhone":"(301) 779-4605",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.2689833441,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"16:30",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Marlboro Churches Food Bank",
        "description":"Prepared meals",
        "address":"4610 Largo Rd. Upper Marlboro MD 20772",
        "latitude":38.82548,
        "longitude":-76.74886,
        "contactPhone":"(240) 447-8712",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":15.2296717898,
        "offersDelivery":true,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"07:00",
            "close":"09:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Laurel Advocacy & Referral Services, Inc.",
        "description":"Loose groceries",
        "address":"311 Laurel Ave Laurel MD 20707",
        "latitude":39.1016588974,
        "longitude":-76.8477751504,
        "contactPhone":"(301) 776-0442",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":9.1202143926,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"17:00",
            "close":"19:30"
          },
          "tuesday":{
            "open":"09:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Must reside in the following zip codes (20707, 20708, 20723, 20724). Be sure to bring the following documents: Valid photo ID for all adult household members (+18), birth certificate or passport for all children (0-17) and proof of Laurel address."
      },
      {
        "name":"Dar Al-Hijrah Islamic Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3159 Row Street Falls Church VA 22044",
        "latitude":38.86171,
        "longitude":-77.14652,
        "contactPhone":"(216) 262-1669",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":14.2855095966,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":"Reopening after Construction on November 21, 2024. Closed NOV 28, DEC 26 & JAN 2 for holidays, and then resuming as normal."
      },
      {
        "name":"Our Lady Queen of Peace Church",
        "description":"Loose groceries",
        "address":"2700 19th Street South Arlington VA 22204",
        "latitude":38.8541288,
        "longitude":-77.0831513219,
        "contactPhone":"(703) 979-5580",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":12.1980853429,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"08:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Salvation Army  (PW County)",
        "description":"Loose groceries",
        "address":"1483 Old Bridge Road #102 Woodbridge VA 22192",
        "latitude":38.67215,
        "longitude":-77.26169,
        "contactPhone":"(703) 580-8991",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":28.0234174438,
        "offersDelivery":false,
        "openingHours":{
          "4th thursday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Food Drive"
      },
      {
        "name":"Emory Beacon of Light, Inc.",
        "description":"Loose groceries",
        "address":"6100 Georgia Avenue NW  Washington  DC 20011",
        "latitude":38.9641578,
        "longitude":-77.0281926297,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":5.1661134203,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Recovery Program Solutions of Virginia",
        "description":"Pre-bagged or boxed groceries,Prepared meals",
        "address":"7611 Little River Turnpike Suite E100 Annandale VA 22003",
        "latitude":38.83154,
        "longitude":-77.20901,
        "contactPhone":"(703) 939-0869",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":18.2217984859,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"16:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"16:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"We Are Family",
        "description":"Pre-bagged or boxed groceries",
        "address":"3335 Sherman Ave NW Washington DC 20001",
        "latitude":38.9315816,
        "longitude":-77.0263815,
        "contactPhone":"(202) 487-8698",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.2269337053,
        "offersDelivery":true,
        "openingHours":{
          "3rd and 4th saturday of the month":{
            "open":"10:00",
            "close":"18:00"
          }
        },
        "specialNotes":"Provide emergency food by request, as needed. Please call Mark Andersen at 202-487-8698 to get more information. Thanks!"
      },
      {
        "name":"Gospel Assembly Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"8740 Cherry Lane Laurel MD 20707",
        "latitude":39.08854,
        "longitude":-76.85273,
        "contactPhone":"(301) 605-3756",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":8.2147268022,
        "offersDelivery":false,
        "openingHours":{
          "1st saturday of the month":{
            "open":"11:00",
            "close":"13:00"
          },
          "3rd saturday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Restoration Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"119 Centerway Dr. Greenbelt MD 20770",
        "latitude":39.00188,
        "longitude":-76.87637,
        "contactPhone":"(240) 645-7177",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.4044101227,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"13:00"
          },
          "2nd and 4th sunday of the month":{
            "open":"11:30",
            "close":"12:30"
          }
        },
        "specialNotes":"THE FOOD PANTRY IS CLOSED ON NOVEMBER 27, 2024 BUT WILL REOPEN ON DECEMBER 4, 2027"
      },
      {
        "name":"Clifton Park Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"8818 Piney Branch Rd Silver Spring MD 20903",
        "latitude":38.9869091859,
        "longitude":-77.0131849571,
        "contactPhone":"(240) 372-3616",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.0531438883,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Serving residents from zip codes 20901, 20903, 20910, 20910"
      },
      {
        "name":"Clifton Park Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"8818 Piney Branch Rd Silver Spring MD 20903",
        "latitude":38.9869091859,
        "longitude":-77.0131849571,
        "contactPhone":"(240) 372-3616",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":4.0531438883,
        "offersDelivery":false,
        "openingHours":{
          "1st saturday of the month":{
            "open":"08:30",
            "close":"10:30"
          }
        },
        "specialNotes":"Serving residents from zip codes 20901, 20903, 20910, 20910"
      },
      {
        "name":"River Jordan, Inc.",
        "description":"Pre-bagged or boxed groceries",
        "address":"15809 Livingston Road Accokeek MD 20607",
        "latitude":38.670722107,
        "longitude":-77.0133000549,
        "contactPhone":"(301) 873-8704",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":22.4110065164,
        "offersDelivery":true,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"16:00",
            "close":"Until Food Runs Out"
          },
          "4th saturday of the month":{
            "open":"09:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":"First come. First serve.  Drive Thru line starts at corner of Bryan Point Road and  Hickory Knoll Road (FRANKS WAY)."
      },
      {
        "name":"Oxon Hill Church of Christ",
        "description":"Pre-bagged or boxed groceries",
        "address":"4201 Brinkley Road Temple Hills MD 20748",
        "latitude":38.8040023385,
        "longitude":-76.9520742509,
        "contactPhone":"(301) 875-9322",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.8535516353,
        "offersDelivery":true,
        "openingHours":{
          "4th wednesday of the month":{
            "open":"09:00",
            "close":"11:00"
          },
          "2nd and 4th saturday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Beltsville Adventist Community Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4200 Ammendale Rd. Beltsville MD 20705",
        "latitude":39.052904,
        "longitude":-76.921884,
        "contactPhone":"(301) 937-8119",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.4498136186,
        "offersDelivery":true,
        "openingHours":{
          "4th friday of the month":{
            "open":"10:30",
            "close":"13:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Beltsville Adventist Community Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4200 Ammendale Rd. Beltsville MD 20705",
        "latitude":39.052904,
        "longitude":-76.921884,
        "contactPhone":"(301) 937-8119",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":4.4498136186,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"09:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Sterling United Methodist Church",
        "description":"",
        "address":"304 East Church Road Sterling VA 20164",
        "latitude":39.0078829,
        "longitude":-77.3928167503,
        "contactPhone":"(703) 430-6455",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":24.4653389205,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"07:30",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Springfield Christian Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"5407 Backlick Rd Springfield VA 22151",
        "latitude":38.7541091612,
        "longitude":-77.1846595658,
        "contactPhone":"(703) 507-6689",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":21.0074368361,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"13:30",
            "close":"16:30"
          }
        },
        "specialNotes":"Bring your \"Food Bank\" card"
      },
      {
        "name":"Revival Baptist Ministries INT",
        "description":"Loose groceries",
        "address":"8174 Richmond Hwy Alexandria VA 22309",
        "latitude":38.7926155834,
        "longitude":-77.0567369681,
        "contactPhone":"(703) 944-3057",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":15.0447653223,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"07:00",
            "close":"09:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Montgomery County Muslim Foundation",
        "description":"Pre-bagged or boxed groceries",
        "address":"11 Park Ave Gaithersburg MD 20877",
        "latitude":39.14316465,
        "longitude":-77.19465555,
        "contactPhone":"(301) 800-1597",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":17.3867857596,
        "offersDelivery":true,
        "openingHours":{
          "2nd sunday of the month":{
            "open":"11:00",
            "close":"12:30"
          }
        },
        "specialNotes":"MCMF has  pantry distribution on 2nd Sunday or 3rd Sunday once a month. Panty is open Monday to Friday from 10 am to 5 pm and serve food to anyone who walks-in or make an appointment."
      },
      {
        "name":"Mt. Calvary Catholic Church, Ladies of Charity Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"6706 Marlboro Pike Forestville MD 20747",
        "latitude":38.85242565,
        "longitude":-76.8896949007,
        "contactPhone":"(301) 221-2546",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":9.8310425624,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"09:00",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Zion Church Inc.",
        "description":"Loose groceries",
        "address":"8829 Greenbelt Rd  Greenbelt MD 20770",
        "latitude":38.9962887855,
        "longitude":-76.8966753486,
        "contactPhone":"(301) 633-9592",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.2548895372,
        "offersDelivery":true,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"08:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Anne's Episcopal Church ( Food Pantry)",
        "description":"Loose groceries",
        "address":"1700 Wainwright Drive Reston VA 20190",
        "latitude":38.96694,
        "longitude":-77.35265,
        "contactPhone":"(925) 323-7084",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":22.3380943154,
        "offersDelivery":true,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"11:30",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Macedonia Baptist Church",
        "description":"Loose groceries",
        "address":"4115 Alabama Ave SE  Washington DC 20019",
        "latitude":38.87060965,
        "longitude":-76.942279583,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.2319617938,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Iglesia De Dios Pentecostal Nuevo Renacer",
        "description":"Loose groceries",
        "address":"490 Victoria Court Millersville MD 21108",
        "latitude":39.11537,
        "longitude":-76.62088,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":19.0933635589,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:30",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Calvary Pentecostal Ministries",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7910 Cessna Avenue Gaithersburg MD 20879",
        "latitude":39.17217,
        "longitude":-77.16221,
        "contactPhone":"(301) 775-0404",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":17.4304462344,
        "offersDelivery":true,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"19:00",
            "close":"20:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Samaritan Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"1100 Florida Ave NE Washington DC 20002",
        "latitude":38.9036929,
        "longitude":-76.9915543954,
        "contactPhone":"(202) 397-1870",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.6074335081,
        "offersDelivery":true,
        "openingHours":{
          "2nd and 4th wednesday of the month":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":"We provide clothing and a small portion of food on the 3rd Saturday of each month starting on 10/19/2024 hours are 10:00am- 12noon at the AGAPE Clothes and Food Pantry. The location is 1105 Florida Avenue, N.E .Washington, DC 20002"
      },
      {
        "name":"This Generation Ministries",
        "description":"Pre-bagged or boxed groceries",
        "address":"9470 Annapolis Rd Suite 407 Lanham MD 20706",
        "latitude":38.96524,
        "longitude":-76.84091,
        "contactPhone":"(240) 374-2901",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":5.4718163778,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"13:30",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"ADAMS CENTER",
        "description":"Loose groceries",
        "address":"46903 Sugarland Road Sterling VA 20164",
        "latitude":39.0065126,
        "longitude":-77.3792995008,
        "contactPhone":"(703) 501-7990",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":23.7358979861,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"17:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"17:00"
          },
          "friday":{
            "open":"10:00",
            "close":"17:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"17:00"
          },
          "sunday":{
            "open":"10:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Kitchen of Purpose",
        "description":"Prepared meals",
        "address":"918 S. Lincoln St Suite 2 Arlington VA 22204",
        "latitude":38.8616,
        "longitude":-77.09346,
        "contactPhone":"(703) 574-1058",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":12.179822336,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"15:00",
            "close":"17:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Greater Morning Star Apostolic Church",
        "description":"Loose groceries",
        "address":"7929 Richmond Highway Alexandria VA 22306-",
        "latitude":38.7926155834,
        "longitude":-77.0567369681,
        "contactPhone":"(913) 290-0606",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":15.0447653223,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"10:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Groveton Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"6511 Richmond Highway  Alexandria VA 22306",
        "latitude":38.7926155834,
        "longitude":-77.0567369681,
        "contactPhone":"(301) 648-5808",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":15.0447653223,
        "offersDelivery":true,
        "openingHours":{
          "friday":{
            "open":"10:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The St. Lucy Project",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"8426-28 Kao Circle Manassas VA 20110",
        "latitude":38.76133,
        "longitude":-77.44914,
        "contactPhone":"(703) 991-6940",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":31.7098028272,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"09:00",
            "close":"09:00"
          },
          "thursday":{
            "open":"13:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Nourish Now",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"397 EAST GUDE DR Rockville MD 20850",
        "latitude":39.1063747576,
        "longitude":-77.1516701515,
        "contactPhone":"(240) 750-0747",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":14.0246796008,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"12:30",
            "close":"14:30"
          },
          "tuesday":{
            "open":"12:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"12:30",
            "close":"14:30"
          },
          "1st thursday of the month":{
            "open":"13:00",
            "close":"15:00"
          },
          "friday":{
            "open":"13:30",
            "close":"15:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Salvation Army Arlington Corps",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"518 S. Glebe Rd Arlington VA 22204",
        "latitude":38.86650405,
        "longitude":-77.0953878977,
        "contactPhone":"(703) 979-3380",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.0085261165,
        "offersDelivery":false,
        "openingHours":{
          "1st and 2nd thursday of the month":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":"Until supplies last"
      },
      {
        "name":"Mt. Jezreel Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"420 University Blvd East Silver Spring MD 20901",
        "latitude":39.00871,
        "longitude":-76.9975,
        "contactPhone":"(301) 461-4257",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":3.464351523,
        "offersDelivery":true,
        "openingHours":{
          "1st saturday of the month":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":"No restrictions on client's location.  300 non-perishable food bags and produce distributed until gone."
      },
      {
        "name":"Muslim Community Center",
        "description":"Pre-bagged or boxed groceries",
        "address":"15200 New Hampshire Ave. Silver Spring MD 20905",
        "latitude":39.076572,
        "longitude":-77.0018621,
        "contactPhone":"(240) 784-0051",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.9173600861,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":"provisions are available for emergency cases. some family may need assistance during the week"
      },
      {
        "name":"Good Success Christian Church",
        "description":"Loose groceries",
        "address":"4401 Sheriff Rd NE Washington DC 20019",
        "latitude":38.9025459,
        "longitude":-76.9389824084,
        "contactPhone":"(301) 661-5442",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.0221688211,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"ABSYNA, Inc. - Brentwood",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4142 Bunker Hill Rd Brentwood MD 20722",
        "latitude":38.9396884689,
        "longitude":-76.9530132394,
        "contactPhone":"(240) 374-8864",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.5508407949,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"10:00",
            "close":"17:30"
          }
        },
        "specialNotes":"Only residents of the (7) residential buildings may receive food."
      },
      {
        "name":"WeSERVE CDC",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"17948 Fraley Blvd Dumfries VA 22026",
        "latitude":38.56244,
        "longitude":-77.3286794063,
        "contactPhone":"(571) 781-2722",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":36.2602310895,
        "offersDelivery":true,
        "openingHours":{
          "1st saturday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":"Until food is gone!"
      },
      {
        "name":"Royal Missionary Baptist Church",
        "description":"Loose groceries",
        "address":"8631 Engleside Office Park Alexandria VA 22309",
        "latitude":38.72297,
        "longitude":-77.11779,
        "contactPhone":"(571) 481-1896",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":20.8190253547,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"08:00",
            "close":"13:00"
          },
          "sunday":{
            "open":"13:00",
            "close":"14:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First Baptist Church of Silver Spring Food Closet",
        "description":"Pre-bagged or boxed groceries",
        "address":"828 Wayne Ave Silver Spring MD 20910",
        "latitude":38.9965219494,
        "longitude":-77.0225460042,
        "contactPhone":"(301) 466-8263",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.5753256113,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Cornerstone Peaceful Bible Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9010 Frank Tippett Road Upper Marlboro MD 20772",
        "latitude":38.76553,
        "longitude":-76.82876,
        "contactPhone":"(240) 346-4169",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":16.5621092693,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"09:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":"may close prior to 3pm if all food has been distributed, and no more available."
      },
      {
        "name":"Cornerstone Peaceful Bible Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9010 Frank Tippett Road Upper Marlboro MD 20772",
        "latitude":38.76553,
        "longitude":-76.82876,
        "contactPhone":"(240) 346-4169",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":16.5621092693,
        "offersDelivery":true,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"16:30",
            "close":"18:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Kings and Priests International Ministries",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"520 Randolph Road Silver Spring MD 20904",
        "latitude":39.0535840659,
        "longitude":-77.1058332797,
        "contactPhone":"(301) 467-6646",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":10.0420927002,
        "offersDelivery":true,
        "openingHours":{
          "sunday":{
            "open":"12:30",
            "close":"15:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Kings and Priests International Ministries",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"520 Randolph Road Silver Spring MD 20904",
        "latitude":39.0535840659,
        "longitude":-77.1058332797,
        "contactPhone":"(301) 467-6646",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":10.0420927002,
        "offersDelivery":false,
        "openingHours":{
          "1st and 3rd wednesday of the month":{
            "open":"17:00",
            "close":"19:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Second Baptist Church Southwest",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"5501 Silver Hill Road District Heights MD 20747",
        "latitude":38.8597625536,
        "longitude":-76.9028793349,
        "contactPhone":"(301) 420-2929",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.1720429236,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"07:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Our Savior Lutheran Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"13611 Laurel Bowie Road Laurel MD 20708",
        "latitude":39.073761602,
        "longitude":-76.8480253061,
        "contactPhone":"(240) 462-8809",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":7.5466324419,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Prince Emmanuel All Nations SDA Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1925 Mitchellville Rd Bowie MD 20716",
        "latitude":38.9156728,
        "longitude":-76.7216523062,
        "contactPhone":"(301) 648-4884",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.6904699628,
        "offersDelivery":false,
        "openingHours":{
          "4th sunday of the month":{
            "open":"13:00",
            "close":"15:00"
          }
        },
        "specialNotes":"provides walk up and home delivery distribution"
      },
      {
        "name":"No Limits Outreach Ministries",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7721 Barlowe Rd Landover MD 20785",
        "latitude":38.9181706604,
        "longitude":-76.8735706758,
        "contactPhone":"(202) 341-5159",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.0279408909,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"18:00",
            "close":"19:30"
          },
          "sunday":{
            "open":"12:30",
            "close":"13:30"
          }
        },
        "specialNotes":"Email Nolimitsfoodpantry@gmail.com for appointment"
      },
      {
        "name":"Ark of Grace Mission, Inc",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3311 Brightseat Road  Lanham MD 20706",
        "latitude":38.9299248,
        "longitude":-76.8592460714,
        "contactPhone":"(240) 535-7832",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":5.9050791934,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"12:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Stephen's Baptist Church",
        "description":"Loose groceries",
        "address":"5757 Temple Hill Road Camp Springs MD 20748",
        "latitude":38.8040834,
        "longitude":-76.9332718019,
        "contactPhone":"(240) 350-8132",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":12.8273222784,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"11:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Breath of Life SDA Church",
        "description":"Loose groceries",
        "address":"11310 Fort Washington Road Fort Washington MD 20744",
        "latitude":38.7396063,
        "longitude":-77.0000326532,
        "contactPhone":"(301) 292-2100",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":17.6013533137,
        "offersDelivery":false,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"09:30",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"University of Maryland College Park Food Pantry",
        "description":"Loose groceries",
        "address":"7093 Preinkert Drive College Park MD 20742",
        "latitude":38.9830927,
        "longitude":-76.943683773,
        "contactPhone":"(301) 314-8072",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":0.5552202561,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"17:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"17:00"
          },
          "friday":{
            "open":"10:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Resurrection Bible Church",
        "description":"",
        "address":"10835 Lanham-Severn Road Glenn Dale MD 20769",
        "latitude":38.9857004,
        "longitude":-76.8215007,
        "contactPhone":"(301) 437-4958",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.2520255725,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Victory Christian Ministries International",
        "description":"Pre-bagged or boxed groceries",
        "address":"3911 St Barnabas Road Suitland MD 20746",
        "latitude":38.8360101327,
        "longitude":-76.9401318673,
        "contactPhone":"(240) 638-6274",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":10.6198022055,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"12:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Mark The Evangelist Catholic Church",
        "description":"Loose groceries",
        "address":"7501 Adelphi Road Hyattsville MD 20783",
        "latitude":38.98309825,
        "longitude":-76.9540500336,
        "contactPhone":"(301) 852-3816",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":0.9847475973,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"09:30",
            "close":"12:00"
          }
        },
        "specialNotes":"Please bring your own reuseable bags to grocery shop."
      },
      {
        "name":"Boat People SOS",
        "description":"Loose groceries",
        "address":"6066 Leesburg Pike Falls Church VA 22041",
        "latitude":38.85784,
        "longitude":-77.14192,
        "contactPhone":"(703) 538-2190",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":14.2617019738,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"14:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Chrisma Charities",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"12805 Georgia Avenue Silver Spring MD 20906",
        "latitude":39.0843802429,
        "longitude":-77.0782142561,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":9.9791490789,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Participant pick-up/Silver Spring delivery locations"
      },
      {
        "name":"Chrisma Charities",
        "description":"Pre-bagged or boxed groceries",
        "address":"12805 Georgia Avenue Silver Spring MD 20906",
        "latitude":39.0843802429,
        "longitude":-77.0782142561,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":9.9791490789,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"08:00",
            "close":"10:00"
          }
        },
        "specialNotes":"Silver Spring Assembly (also storage location)\t12805 Georgia Ave, Silver Spring, MD  20906"
      },
      {
        "name":"Chrisma Charities",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"12805 Georgia Avenue Silver Spring MD 20906",
        "latitude":39.0843802429,
        "longitude":-77.0782142561,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":9.9791490789,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"11:00"
          },
          "3rd friday of the month":{
            "open":"08:00",
            "close":null
          }
        },
        "specialNotes":"Aspen Hill Apartments\t13539 Georgia Ave, Silver Spring, MD  20906"
      },
      {
        "name":"Chrisma Charities",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"12805 Georgia Avenue Silver Spring MD 20906",
        "latitude":39.0843802429,
        "longitude":-77.0782142561,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.9791490789,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"10:00",
            "close":"14:00"
          },
          "1st, 2nd, and 4th saturday of the month":{
            "open":"08:00",
            "close":null
          }
        },
        "specialNotes":"Wheaton Regional Park\t1700 University Blvd. W, Wheaton, MD  20902"
      },
      {
        "name":"CAC Bethel Fellowship Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"7513 Northern Avenue Glenn Dale MD 20769",
        "latitude":38.9934902,
        "longitude":-76.8201445625,
        "contactPhone":"(301) 352-2900",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.3238242326,
        "offersDelivery":false,
        "openingHours":{
          "1st and 2nd saturday of the month":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"CAC Bethel Fellowship Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7513 Northern Avenue Glenn Dale MD 20769",
        "latitude":38.9934902,
        "longitude":-76.8201445625,
        "contactPhone":"(301) 352-2900",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.3238242326,
        "offersDelivery":true,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Church of the Resurrection",
        "description":"Pre-bagged or boxed groceries",
        "address":"5150 Fillmore Ave Alexandria VA 22311",
        "latitude":38.83868475,
        "longitude":-77.1177196077,
        "contactPhone":"(703) 998-0888",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":14.2279597209,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"17:00",
            "close":"18:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Community of Faith United Methodist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"13224 Franklin Farm Rd Herndon VA 20171",
        "latitude":38.9088706,
        "longitude":-77.4077067,
        "contactPhone":"(703) 620-1977",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":25.8604950044,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"ICNA Relief USA Programs Inc.",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"2912 Woodlawn Trail Alexandria VA 22306",
        "latitude":38.75172,
        "longitude":-77.08221,
        "contactPhone":"(571) 662-0786",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":18.1857280189,
        "offersDelivery":true,
        "openingHours":{
          "1st and 3rd thursday of the month":{
            "open":"14:00",
            "close":"16:00"
          }
        },
        "specialNotes":"location: 2912 Woodlawn Trail Alexandria VA 22306"
      },
      {
        "name":"ICNA Relief USA Programs Inc.",
        "description":"",
        "address":"2912 Woodlawn Trail Alexandria VA 22306",
        "latitude":38.75172,
        "longitude":-77.08221,
        "contactPhone":"(571) 662-0786",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":18.1857280189,
        "offersDelivery":false,
        "openingHours":{
          "2nd thursday of the month":{
            "open":"12:30",
            "close":"13:30"
          }
        },
        "specialNotes":"location: Near The Jefferson Leesburg Pike Falls Church VA 22044"
      },
      {
        "name":"City of David Ministries",
        "description":"",
        "address":"2900 Boones Lane District Heights MD 20747",
        "latitude":38.84978,
        "longitude":-76.88064,
        "contactPhone":"(301) 200-2489",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.1442186128,
        "offersDelivery":true,
        "openingHours":{
          "4th saturday of the month":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Freedom Community Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9325 Mace Street Manassas Park VA 20111",
        "latitude":38.78158445,
        "longitude":-77.478679722,
        "contactPhone":"(571) 409-4892",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":32.4499370198,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Ebenezer Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"13020 Telegraph Road Woodbridge VA 22192",
        "latitude":38.661439223,
        "longitude":-77.2847089926,
        "contactPhone":"(703) 376-1664",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":29.3789015542,
        "offersDelivery":false,
        "openingHours":{
          "sunday":{
            "open":"11:30",
            "close":"12:00"
          }
        },
        "specialNotes":"Pantry Food Only"
      },
      {
        "name":"Salvation Army (Fairfax)",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4915 Ox Road Fairfax VA 22030",
        "latitude":38.8252891891,
        "longitude":-77.3170192384,
        "contactPhone":"(703) 385-8700",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":23.3401915452,
        "offersDelivery":false,
        "openingHours":{
          "4th monday of the month":{
            "open":"12:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Salvation Army (Fairfax)",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4915 Ox Road Fairfax VA 22030",
        "latitude":38.8252891891,
        "longitude":-77.3170192384,
        "contactPhone":"(703) 385-8700",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":23.3401915452,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"09:00",
            "close":"16:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"A Place for Hashem Ministries",
        "description":"Pre-bagged or boxed groceries",
        "address":"8100 Malcolm Rd Clinton MD 20735",
        "latitude":38.77873,
        "longitude":-76.88857,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":14.8153057663,
        "offersDelivery":true,
        "openingHours":{
          "1st saturday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Apostolic Church Glorious Vision",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3004 Enterprise Road Bowie MD 20721",
        "latitude":38.93160895,
        "longitude":-76.806470803,
        "contactPhone":"(757) 275-3905",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.1175392357,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th sunday of the month":{
            "open":"13:00",
            "close":"15:00"
          }
        },
        "specialNotes":"20721"
      },
      {
        "name":"New Hope and Life Church of God, Inc.",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"8616 Edgeworth Drive Capitol Heights MD 20743",
        "latitude":38.88091,
        "longitude":-76.85656,
        "contactPhone":"(202) 689-4393",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.6928550841,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":"Appointments can be made in case of emergency"
      },
      {
        "name":"Cheer, Inc.",
        "description":"Pre-bagged or boxed groceries",
        "address":"8720 Carroll Avenue,  Silver Spring MD 20903",
        "latitude":38.9859410577,
        "longitude":-76.9965684732,
        "contactPhone":"(301) 589-3633",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.166854659,
        "offersDelivery":false,
        "openingHours":{
          "1st tuesday of the month":{
            "open":"16:00",
            "close":"17:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Bethesda Help",
        "description":"Pre-bagged or boxed groceries",
        "address":"10100 Old Georgetown Road Bethesda MD 20814",
        "latitude":39.0016497085,
        "longitude":-77.1098521974,
        "contactPhone":"(301) 928-4078",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.2759308618,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"16:30"
          },
          "tuesday":{
            "open":"09:00",
            "close":"16:30"
          },
          "wednesday":{
            "open":"09:00",
            "close":"16:30"
          },
          "thursday":{
            "open":"09:00",
            "close":"16:30"
          },
          "friday":{
            "open":"09:00",
            "close":"16:30"
          }
        },
        "specialNotes":"Clients must call to request food.  Drivers will deliver food within 48 hours"
      },
      {
        "name":"Friends Of Douglass Community Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3261 Stanton Road SE Washington DC 20020",
        "latitude":38.8477205499,
        "longitude":-76.9807019185,
        "contactPhone":"(202) 285-5354",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.0774019476,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"12:00",
            "close":"18:00"
          },
          "1st saturday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Plenty to Eat",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"2315 18th Place NE Washington DC 20018",
        "latitude":38.9207541,
        "longitude":-76.9777389603,
        "contactPhone":"(202) 556-0662",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":5.2247829381,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"15:00"
          },
          "wednesday":{
            "open":"11:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First African Methodist Episcopal Church of Alexandria",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"8653 Richmond Highway Alexandria VA 22309",
        "latitude":38.7926155834,
        "longitude":-77.0567369681,
        "contactPhone":"(571) 758-9141",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":15.0447653223,
        "offersDelivery":true,
        "openingHours":{
          "2nd wednesday of the month":{
            "open":"08:30",
            "close":"13:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Francis Xavier Church Food Pantry",
        "description":"Pre-bagged or boxed groceries",
        "address":"2815 O street SE Washington DC 20020",
        "latitude":38.87251805,
        "longitude":-76.9672683953,
        "contactPhone":"(202) 251-7692",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.2500480863,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"09:00",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Holy Mountain International Ministries",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"6721 Mid Cities Avenue Beltsville MD 20705",
        "latitude":39.0537607358,
        "longitude":-76.8886135564,
        "contactPhone":"(443) 367-1951",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.1538979456,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"10:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":"Can call to make an appointment any day"
      },
      {
        "name":"Ayuda, Inc.",
        "description":"Loose groceries",
        "address":"1990 K St. NW Suite 500 Washington DC 20006",
        "latitude":38.90194,
        "longitude":-77.04453,
        "contactPhone":"(703) 589-4204",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":8.3464365032,
        "offersDelivery":false,
        "openingHours":{
          "3rd wednesday of the month":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Oxon Hill UMC",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"6400 Livingston Road Oxon Hill MD 20745",
        "latitude":38.801123,
        "longitude":-76.986288505,
        "contactPhone":"(240) 687-1409",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":13.2879026326,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Christ Embassy Maryland",
        "description":"Pre-bagged or boxed groceries",
        "address":"1221 Carraway Court Suite 1010 Largo MD 20774",
        "latitude":38.9063,
        "longitude":-76.8438,
        "contactPhone":"(301) 537-1765",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.6628911644,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Iglesia Evangelica Cristo Promesa Fiel",
        "description":"Pre-bagged or boxed groceries",
        "address":"17017 Georgia Avenue Olney MD 20832",
        "latitude":39.1358093874,
        "longitude":-77.0696813906,
        "contactPhone":"(301) 408-8302",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.3277729035,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"17:00",
            "close":"20:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Operation Earnie's Plate",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"8500 Mike Shapiro Dr Clinton MD 20735",
        "latitude":38.7725,
        "longitude":-76.8819,
        "contactPhone":"(301) 404-4461",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":15.3054602619,
        "offersDelivery":true,
        "openingHours":{
          "2nd monday of the month":{
            "open":"12:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"08:00",
            "close":"14:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"14:00"
          },
          "nan":{
            "open":"08:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Calvary Episcopal Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"509 I Street NE Washington DC 20002",
        "latitude":38.90112235,
        "longitude":-76.9987621114,
        "contactPhone":"(858) 405-6276",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":6.9418043488,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Tutoring Cafe",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"6906 4th St NW Washington DC 20012",
        "latitude":38.9739669,
        "longitude":-77.0183635,
        "contactPhone":"(240) 601-3312",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.4615233059,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"14:30",
            "close":"15:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First African Methodist Episcopal Church of Gaithersburg",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"17620 Washington Grove Lane Gaithersburg MD 20877",
        "latitude":39.1392644717,
        "longitude":-77.179956599,
        "contactPhone":"(240) 632-9760",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":16.5999541247,
        "offersDelivery":false,
        "openingHours":{
          "1st saturday of the month":{
            "open":"14:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Harvest Gleaners",
        "description":"Loose groceries",
        "address":"3210 Norbeck Road Silver Spring MD 20906",
        "latitude":39.111,
        "longitude":-77.06529,
        "contactPhone":"(301) 503-7397",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":10.8185160087,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"12:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Impact One Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7230 Central Avenue Capitol Heights MD 20743",
        "latitude":38.88843,
        "longitude":-76.8811,
        "contactPhone":"(301) 333-2083",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.6318818855,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":"11 - until supplies last, please stress that client must register and receive an appointment  timeahead of time at this link: impactonechurch.churchcenter.com"
      },
      {
        "name":"Royalhouse Chapel International",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7911 Braygreen Road Laurel MD 20707",
        "latitude":39.0804025556,
        "longitude":-76.8707473333,
        "contactPhone":"(301) 437-9441",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.2267543765,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Drive through"
      },
      {
        "name":"Royalhouse Chapel International",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7911 Braygreen Road Laurel MD 20707",
        "latitude":39.0804025556,
        "longitude":-76.8707473333,
        "contactPhone":"(301) 437-9441",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.2267543765,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"12:30",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Community Health Foundation",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9150 Lanham Severn Rd.  Lanham MD 20706",
        "latitude":38.96756335,
        "longitude":-76.8563501192,
        "contactPhone":"(240) 353-1699",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.6345319112,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Sanctuary",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"5300 Crain Highway Upper Marlboro MD 20772",
        "latitude":38.8130056955,
        "longitude":-76.7584438192,
        "contactPhone":"(301) 752-0778",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":15.5582071343,
        "offersDelivery":true,
        "openingHours":{
          "4th saturday of the month":{
            "open":"10:00",
            "close":"12:30"
          }
        },
        "specialNotes":"Call ahead! The X Saturday of the month differs"
      },
      {
        "name":"Jamil-UL Jalil",
        "description":"Loose groceries",
        "address":"10845 Lanham Severn Road Glenn Dale MD 20769",
        "latitude":38.9859145,
        "longitude":-76.8210757,
        "contactPhone":"(240) 381-1143",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.2741846263,
        "offersDelivery":true,
        "openingHours":{
          "3rd friday of the month":{
            "open":"09:30",
            "close":"16:30"
          },
          "2nd and 3rd friday of the month":{
            "open":"09:30",
            "close":"11:00"
          }
        },
        "specialNotes":"Our distribution is every third week of the month, Starting 9:3am till 11:30am, then from 2:00pm till 4:30pm becaus of prayer time."
      },
      {
        "name":"Church of The Redeemer of Gaithersburg",
        "description":"Pre-bagged or boxed groceries",
        "address":"19425 Woodfield Road Gaithersburg MD 20879",
        "latitude":39.1509723266,
        "longitude":-77.1742989837,
        "contactPhone":"(240) 238-1576",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":16.8852478605,
        "offersDelivery":true,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":"While supplies last."
      },
      {
        "name":"Antioch Baptist Church of Clinton",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9107 Pine View Lane Clinton MD 20735",
        "latitude":38.89065,
        "longitude":-76.93169,
        "contactPhone":"(301) 868-3877",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.8516428247,
        "offersDelivery":true,
        "openingHours":{
          "2nd friday of the month":{
            "open":"14:00",
            "close":"17:00"
          },
          "2nd saturday of the month":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":"Montgomery and Prince Georges County residents"
      },
      {
        "name":"South Lakes High School PTSA Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1133 Reston AVE Herndon VA 20170",
        "latitude":38.99613965,
        "longitude":-77.341842723,
        "contactPhone":"(703) 216-6928",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":21.7022720318,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"16:30",
            "close":"17:30"
          }
        },
        "specialNotes":"Must be family of student enrolled in South Lakes Pyramid schools."
      },
      {
        "name":"South Lakes High School PTSA Food Pantry",
        "description":"Loose groceries",
        "address":"1133 Reston AVE Herndon VA 20170",
        "latitude":38.99613965,
        "longitude":-77.341842723,
        "contactPhone":"(703) 216-6928",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":21.7022720318,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"14:30",
            "close":"15:30"
          }
        },
        "specialNotes":"Must be a student enrolled at South Lakes High School"
      },
      {
        "name":"Mother of Light Center",
        "description":"",
        "address":"421 Clifford Ave Alexandria VA 22305",
        "latitude":38.8320335973,
        "longitude":-77.0530997124,
        "contactPhone":"(703) 508-5289",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.53403899,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"13:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"13:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mother of Light Center",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"421 Clifford Ave Alexandria VA 22305",
        "latitude":38.8320335973,
        "longitude":-77.0530997124,
        "contactPhone":"(703) 508-5289",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.53403899,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Matthias Catholic Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9475 Annapolis Lanham MD 20706",
        "latitude":38.9654817639,
        "longitude":-76.8450683796,
        "contactPhone":"(301) 459-4814",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.2544778802,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th friday of the month":{
            "open":"09:00",
            "close":"Until Food Runs Out"
          },
          "2nd nan of the month":{
            "open":"08:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Service Insights ID"
      },
      {
        "name":"First Baptist Church of Highland Park",
        "description":"Pre-bagged or boxed groceries",
        "address":"6801 Sheriff Road Landover MD 20785",
        "latitude":38.909774,
        "longitude":-76.890797,
        "contactPhone":"(301) 773-6655",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":6.0725686739,
        "offersDelivery":true,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"09:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":"Can make appointments on non-distribution days"
      },
      {
        "name":"Alexander Memorial Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"10675 Crain Highway Upper Marlboro MD 20772",
        "latitude":38.8130056955,
        "longitude":-76.7584438192,
        "contactPhone":"(240) 601-0247",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":15.5582071343,
        "offersDelivery":true,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":"Income reporting if applying for TEFAP"
      },
      {
        "name":"Alexander Memorial Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"10675 Crain Highway Upper Marlboro MD 20772",
        "latitude":38.8130056955,
        "longitude":-76.7584438192,
        "contactPhone":"(240) 601-0247",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":15.5582071343,
        "offersDelivery":false,
        "openingHours":{
          "sunday":{
            "open":"12:00",
            "close":"13:00"
          }
        },
        "specialNotes":"Income reporting for TEFAP only."
      },
      {
        "name":"Living Legends Awards for Service to Humanity",
        "description":"Pre-bagged or boxed groceries",
        "address":"18800 New Hampshire Avenue Ashton MD 20861",
        "latitude":39.16457,
        "longitude":-77.015446,
        "contactPhone":"(240) 832-1039",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.7801210169,
        "offersDelivery":true,
        "openingHours":{
          "sunday":{
            "open":"07:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mollemm Food Pantry",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9721 Good Luck Road Lanham MD 20706",
        "latitude":38.98312955,
        "longitude":-76.8411956991,
        "contactPhone":"(301) 248-7742",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.2081030434,
        "offersDelivery":true,
        "openingHours":{
          "4th tuesday of the month":{
            "open":"10:00",
            "close":"13:00"
          },
          "3rd wednesday of the month":{
            "open":"13:00",
            "close":"14:30"
          },
          "2nd thursday of the month":{
            "open":"13:00",
            "close":"14:30"
          },
          "3rd saturday of the month":{
            "open":"11:00",
            "close":"11:30"
          },
          "3rd sunday of the month":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":"This site is for drop off only for senior residents"
      },
      {
        "name":"Guru Nanak Foundation of America (GNFA)",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"12917 Old Columbia Pike Silver Spring MD 20904",
        "latitude":39.07367219,
        "longitude":-76.9591776011,
        "contactPhone":"(301) 728-7138",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.9143456097,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th sunday of the month":{
            "open":"12:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Faith Village of Greater Laurel, Inc.",
        "description":"Pre-bagged or boxed groceries",
        "address":"13714 Briarwood Drive  Laurel MD 20708",
        "latitude":39.0799744234,
        "longitude":-76.8560830123,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":7.6249684008,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Hughes United Methodist Church",
        "description":"Loose groceries",
        "address":"10700 Georgia Ave Wheaton  MD 20902",
        "latitude":39.0307141,
        "longitude":-77.0483782,
        "contactPhone":"(301) 949-8383",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.5784389048,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"09:30",
            "close":"12:00"
          },
          "wednesday":{
            "open":"09:30",
            "close":"11:00"
          }
        },
        "specialNotes":"Montgomery County Residents"
      },
      {
        "name":"Seneca Creek Community Church (Gaithersburg CARES)",
        "description":"Other",
        "address":"13 Firstfield Rd Gaithersburg MD 20878",
        "latitude":39.140033,
        "longitude":-77.225364,
        "contactPhone":"(301) 793-3321",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":18.5978973404,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"16:30"
          },
          "thursday":{
            "open":"10:00",
            "close":"16:30"
          },
          "friday":{
            "open":"13:00",
            "close":"16:00"
          },
          "1st saturday of the month":{
            "open":"09:30",
            "close":"12:30"
          }
        },
        "specialNotes":"Our pantry is by appointment. Anyone needing an appointment should call 301-793-3321 and leave a message. We will call them to schedule an appointment."
      },
      {
        "name":"St. Philip's Episcopal Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"522 Main Street Laurel MD 20707",
        "latitude":39.1072638,
        "longitude":-76.8516972425,
        "contactPhone":"(301) 776-5151",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":9.344996866,
        "offersDelivery":false,
        "openingHours":{
          "3rd sunday of the month":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Offers home deliveries too"
      },
      {
        "name":"The Upcounty Hub Inc",
        "description":"Pre-bagged or boxed groceries",
        "address":"12900 Middlebrook Road Suite 1100  Germantown  MD 20874",
        "latitude":39.17895,
        "longitude":-77.26847,
        "contactPhone":"(240) 912-1068",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":22.0339741133,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"14:00",
            "close":"15:00"
          },
          "wednesday":{
            "open":"13:00",
            "close":"14:30"
          },
          "thursday":{
            "open":"14:00",
            "close":"15:00"
          },
          "friday":{
            "open":"09:00",
            "close":"10:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Upcounty Hub Inc",
        "description":"Pre-bagged or boxed groceries",
        "address":"12900 Middlebrook Road Suite 1100  Germantown  MD 20874",
        "latitude":39.17895,
        "longitude":-77.26847,
        "contactPhone":"(240) 912-1068",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":22.0339741133,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"InterFaith Works",
        "description":"Loose groceries",
        "address":"751 Twinbrook Parkway Rockville MD 20851",
        "latitude":39.0813946606,
        "longitude":-77.1140393988,
        "contactPhone":"(240) 370-4984",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":11.3844145474,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"09:00",
            "close":"16:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"16:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"16:00"
          },
          "friday":{
            "open":"09:00",
            "close":"16:00"
          },
          "saturday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Oak Chapel UMC",
        "description":"Pre-bagged or boxed groceries",
        "address":"14500 Layhill Road Silver Spring MD 20906",
        "latitude":39.09478,
        "longitude":-77.04554,
        "contactPhone":"(240) 277-4426",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.2812920506,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Home deliveries to 65-70 Home Bound Clients"
      },
      {
        "name":"Oak Chapel UMC",
        "description":"Pre-bagged or boxed groceries",
        "address":"14500 Layhill Road Silver Spring MD 20906",
        "latitude":39.09478,
        "longitude":-77.04554,
        "contactPhone":"(240) 277-4426",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.2812920506,
        "offersDelivery":false,
        "openingHours":{
          "2nd thursday of the month":{
            "open":"12:00",
            "close":"13:00"
          },
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":"20906 is the permitted zipcode"
      },
      {
        "name":"Reid Temple AME Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"11400 Glenn Dale Blvd Glenn Dale MD 20769",
        "latitude":38.984805,
        "longitude":-76.81173,
        "contactPhone":"(443) 474-3673",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.7791405491,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"GAP Food Program",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"6715 Suitland Road Morningside MD 20746",
        "latitude":38.8281424595,
        "longitude":-76.8942521081,
        "contactPhone":"(202) 528-4321",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":11.4055783014,
        "offersDelivery":true,
        "openingHours":{
          "sunday":{
            "open":"10:30",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Christ United Methodist 5000 Food Ministry",
        "description":"Loose groceries",
        "address":"900 4th Street SW Washington, DC 20024 Washington DC 20024",
        "latitude":38.87885,
        "longitude":-77.0168,
        "contactPhone":"(202) 669-2664",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":8.7572528213,
        "offersDelivery":true,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"14:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"La Iglesia Episcopal de Santa Maria",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"7000 Arlington Blvd Falls Church VA 22042",
        "latitude":38.86853485,
        "longitude":-77.1854891947,
        "contactPhone":"(703) 244-1158",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":15.7267331152,
        "offersDelivery":false,
        "openingHours":{
          "1st and 3rd tuesday of the month":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"East Montgomery County Hub",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"11710 Beltsville Drive Beltsville MD 20705",
        "latitude":39.0543114898,
        "longitude":-76.9323425155,
        "contactPhone":"(202) 352-7114",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":4.4738742126,
        "offersDelivery":false,
        "openingHours":{
          "3rd wednesday of the month":{
            "open":"17:30",
            "close":"19:00"
          }
        },
        "specialNotes":"This food distribution takes place at Jackson Road Elementary School located at 900 Jackson Road, Silver Spring MD 20904. Distribution takes place in parking lot in front of school."
      },
      {
        "name":"East Montgomery County Hub",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"11710 Beltsville Drive Beltsville MD 20705",
        "latitude":39.0543114898,
        "longitude":-76.9323425155,
        "contactPhone":"(202) 352-7114",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.4738742126,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th tuesday of the month":{
            "open":"17:00",
            "close":"19:00"
          }
        },
        "specialNotes":"This food distribution takes place at Windsor Court and Towers Apartments located at 13900 Castle BLVD, Silver Spring MD 20904."
      },
      {
        "name":"Small Things Matter, Inc",
        "description":"Loose groceries",
        "address":"201 Ethan Allen Avenue Takoma Park MD 20912",
        "latitude":38.97768405,
        "longitude":-77.0059114744,
        "contactPhone":"(202) 669-8550",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.7511985097,
        "offersDelivery":false,
        "openingHours":{
          "1st tuesday of the month":{
            "open":"16:00",
            "close":"18:00"
          },
          "1st and 3rd thursday of the month":{
            "open":"12:00",
            "close":"15:00"
          },
          "friday":{
            "open":"08:30",
            "close":"12:00"
          },
          "1st and 3rd friday of the month":{
            "open":"09:30",
            "close":"11:30"
          },
          "saturday":{
            "open":"12:00",
            "close":"15:00"
          },
          "sunday":{
            "open":"13:00",
            "close":"16:00"
          }
        },
        "specialNotes":"during the school year only"
      },
      {
        "name":"DMV Food Justice Initiative",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3110 Chichester Lane Fairfax VA 22031",
        "latitude":38.86450525,
        "longitude":-77.2486599098,
        "contactPhone":"(202) 415-9757",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":18.8154810576,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The House, Inc.",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"14000 Crown Court Woodbridge VA 22193",
        "latitude":38.73304,
        "longitude":-77.06855,
        "contactPhone":"(571) 237-5860",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":19.077942548,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"15:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"YWCA National Capital Area",
        "description":"Loose groceries",
        "address":"2303 14th Street NW Suite 100 Washington DC 20009",
        "latitude":38.92068,
        "longitude":-77.03165,
        "contactPhone":"(202) 626-0700",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":6.9404426971,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"12:00",
            "close":"15:00"
          }
        },
        "specialNotes":"To ensure fair access for everyone, each person can only come in once a week."
      },
      {
        "name":"Celestial Church of Christ",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1880 Adams Street NE Washington DC 20018",
        "latitude":38.92052,
        "longitude":-76.977626506,
        "contactPhone":"(240) 467-8399",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.2370645019,
        "offersDelivery":false,
        "openingHours":{
          "4th saturday of the month":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Lutheran Church of the Abiding Presence",
        "description":"Loose groceries",
        "address":"6304 Lee Chapel Rd Burke VA 22015",
        "latitude":38.781808776,
        "longitude":-77.2778334526,
        "contactPhone":"(703) 455-7500",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":23.2545412023,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"08:30",
            "close":"11:30"
          }
        },
        "specialNotes":"There is one pantry in December on December 14. For more information go to our website www.abidingpresence.net/needhelp"
      },
      {
        "name":"Park Road Community Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"1019 Park Road NW Washington DC 20010",
        "latitude":38.93222525,
        "longitude":-77.0278059906,
        "contactPhone":"(202) 740-7890",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.2572845639,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Loaves & Fishes",
        "description":"Prepared meals",
        "address":"1525 Newton St NW Washington DC 20910",
        "latitude":38.933592,
        "longitude":-77.0355665,
        "contactPhone":"(240) 855-5874",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.528257661,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"08:30",
            "close":"11:30"
          },
          "sunday":{
            "open":"08:30",
            "close":"11:30"
          }
        },
        "specialNotes":"No verification required"
      },
      {
        "name":"Francis On The Hill",
        "description":"Pre-bagged or boxed groceries",
        "address":"1614 Manchester Lane NW Washington DC 20011-2810",
        "latitude":38.96106275,
        "longitude":-77.0374775996,
        "contactPhone":"(202) 680-0517",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":5.7080858494,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"14:00",
            "close":"15:00"
          }
        },
        "specialNotes":"Distribution is at Meridian Hill Park at 1:30.  It is a good idea to arrive early to get a number."
      },
      {
        "name":"R Street Apartments",
        "description":"Loose groceries",
        "address":"1436 R St NW Washington DC 20009",
        "latitude":38.91237125,
        "longitude":-77.0340147514,
        "contactPhone":"(202) 621-1617",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.4347482854,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"11:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Monsenor Romero",
        "description":"Loose groceries",
        "address":"3145 Mt Pleasant St NW Washington DC 20010",
        "latitude":38.92985945,
        "longitude":-77.0375670137,
        "contactPhone":"(202) 333-8931",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.7695187643,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"11:00",
            "close":"16:00"
          },
          "wednesday":{
            "open":"11:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Villages of East River",
        "description":"Loose groceries",
        "address":"305 37th St SE Washington DC 20019",
        "latitude":38.88541785,
        "longitude":-76.953336713,
        "contactPhone":"(202) 621-1617",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.2535020204,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"16:00"
          },
          "thursday":{
            "open":"11:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Walker Memorial Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"2020 13th St. NW Washington DC 20009",
        "latitude":38.91764,
        "longitude":-77.3,
        "contactPhone":"(202) 232-1120",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":20.0882711119,
        "offersDelivery":true,
        "openingHours":{
          "3rd thursday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Walker Memorial Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"2020 13th St. NW Washington DC 20009",
        "latitude":38.9176047,
        "longitude":-77.0299837005,
        "contactPhone":"(202) 232-1120",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.024789964,
        "offersDelivery":false,
        "openingHours":{
          "1st wednesday of the month":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Food Pantry will be closed on Jan. 1, 2025"
      },
      {
        "name":"Columbia Heights Village Tenant Association",
        "description":"Loose groceries",
        "address":"2900 14th Street NW Suite 110 Washington DC 20009",
        "latitude":38.92698,
        "longitude":-77.03282,
        "contactPhone":"(202) 390-8580",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.6965023544,
        "offersDelivery":false,
        "openingHours":{
          "3rd tuesday of the month":{
            "open":"12:00",
            "close":"19:00"
          },
          "nan":{
            "open":"08:00",
            "close":"20:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Columbia Heights Village Tenant Association",
        "description":"Pre-bagged or boxed groceries,Prepared meals",
        "address":"2900 14th Street NW Suite 110 Washington DC 20009",
        "latitude":38.92698,
        "longitude":-77.03282,
        "contactPhone":"(202) 390-8580",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":6.6965023544,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"12:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Columbia Heights Village Tenant Association",
        "description":"Pre-bagged or boxed groceries",
        "address":"2900 14th Street NW Suite 110 Washington DC 20009",
        "latitude":38.92698,
        "longitude":-77.03282,
        "contactPhone":"(202) 390-8580",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":6.6965023544,
        "offersDelivery":false,
        "openingHours":{
          "2nd tuesday of the month":{
            "open":"13:00",
            "close":"15:00"
          },
          "wednesday":{
            "open":"11:00",
            "close":"15:00"
          },
          "thursday":{
            "open":"12:00",
            "close":"20:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Luther Jackson Middle School Food Pantry",
        "description":"Loose groceries",
        "address":"3020 Gallows Road Falls Church VA 22042",
        "latitude":38.8682,
        "longitude":-77.22926,
        "contactPhone":"(202) 669-2543",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":17.7735160871,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"16:00",
            "close":"17:30"
          }
        },
        "specialNotes":"The pantry is for students and their families only. We do NOT ask for IDs, but parents must tell us the name of their enrolled student, which is verified against our list."
      },
      {
        "name":"First SDA Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"810 Shepherd ST NW Washington DC 20011",
        "latitude":38.93956175,
        "longitude":-77.0236024856,
        "contactPhone":"(202) 997-9663",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.7662119676,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"12:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Emmanuel Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"2409 Ainger Place SE Washington DC 20020",
        "latitude":38.856557,
        "longitude":-76.9718823041,
        "contactPhone":"(202) 678-0884",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.380051673,
        "offersDelivery":true,
        "openingHours":{
          "1st and 3rd thursday of the month":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Burke United Methodist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"6200 Burke Centre Parkway Burke VA 22015",
        "latitude":38.7839784,
        "longitude":-77.2808801688,
        "contactPhone":"(703) 250-6100",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":23.2916161033,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"13:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"18:00",
            "close":"19:00"
          },
          "saturday":{
            "open":"09:00",
            "close":"10:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Buddhist Tzu Chi Foundation",
        "description":"Loose groceries",
        "address":"1516 Moorings Drive Reston VA 20190",
        "latitude":38.96828,
        "longitude":-77.3391,
        "contactPhone":"(804) 306-6037",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":21.6054132815,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"09:30",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Redeemed Christian Church of God - Victory Temple",
        "description":"Loose groceries",
        "address":"7218 Lockport Place Lorton VA 22079",
        "latitude":38.71585,
        "longitude":-77.19248,
        "contactPhone":"(804) 625-9423",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":23.362616477,
        "offersDelivery":true,
        "openingHours":{
          "2nd and 4th saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Greater Little Zion Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"10185 Zion Dr Fairfax VA 22032",
        "latitude":38.8057495,
        "longitude":-77.2976149444,
        "contactPhone":"(703) 728-4513",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":23.1496853153,
        "offersDelivery":true,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"LindaBen Foundation",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"10739 Tucker St.  Beltsville  MD 20705",
        "latitude":39.0261161,
        "longitude":-76.9083386,
        "contactPhone":"(240) 461-9442",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.9720366105,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"12:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Love Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"14370 Lee Highway Suite 105 Gainesville VA 20155",
        "latitude":38.83534,
        "longitude":-77.45543,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":29.8027693203,
        "offersDelivery":false,
        "openingHours":{
          "1st and 3rd thursday of the month":{
            "open":"16:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Love Church",
        "description":"Loose groceries",
        "address":"14370 Lee Highway Suite 105 Gainesville VA 20155",
        "latitude":38.83534,
        "longitude":-77.45543,
        "contactPhone":"",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":29.8027693203,
        "offersDelivery":false,
        "openingHours":{
          "1st tuesday of the month":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"She Believes in Me",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"761 Elden Street Herndon VA 20170",
        "latitude":38.9695251147,
        "longitude":-77.3866952105,
        "contactPhone":"(703) 328-2512",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":24.1511468039,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"11:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"11:00"
          },
          "saturday":{
            "open":"09:30",
            "close":"10:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mid-County Hub at Harvest Intercontinental Church Olney",
        "description":"Pre-bagged or boxed groceries",
        "address":"16227 Batchellors Forest Rd Olney MD 20832",
        "latitude":39.12102,
        "longitude":-77.06901,
        "contactPhone":"(301) 512-5584",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":11.4842606489,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mid-County Hub at Harvest Intercontinental Church Olney",
        "description":"Loose groceries",
        "address":"16227 Batchellors Forest Rd Olney MD 20832",
        "latitude":39.12102,
        "longitude":-77.06901,
        "contactPhone":"(301) 512-5584",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":11.4842606489,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"11:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Destiny Driven",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"5900 Princess Garden Parkway Lanham  MD 20706",
        "latitude":38.9658159361,
        "longitude":-76.8645706167,
        "contactPhone":"(301) 455-5970",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":4.2655311781,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"11:00",
            "close":"13:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"12:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"13:00"
          },
          "friday":{
            "open":"11:00",
            "close":"13:00"
          },
          "saturday":{
            "open":"12:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Love Donation Pantry",
        "description":"Loose groceries",
        "address":"3450 Laurel Fort Meade Rd. Suite 101 Laurel MD 20708",
        "latitude":39.10043,
        "longitude":-76.81451,
        "contactPhone":"(240) 486-4213",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":10.114632465,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"12:00",
            "close":"Until Food Runs Out"
          },
          "friday":{
            "open":"12:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":"Hours remains the same."
      },
      {
        "name":"Largo Community Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"1701 Enterprise Road Mitchellville MD 20721",
        "latitude":38.91387,
        "longitude":-76.7982,
        "contactPhone":"(301) 249-2255",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":9.1497403932,
        "offersDelivery":false,
        "openingHours":{
          "3rd saturday of the month":{
            "open":"11:00",
            "close":"12:00"
          }
        },
        "specialNotes":"On a first come, first serve basis."
      },
      {
        "name":"International High School at Largo",
        "description":"Pre-bagged or boxed groceries",
        "address":"505 Largo Rd SW Side Upper Marlboro MD 20774",
        "latitude":38.88637,
        "longitude":-76.82032,
        "contactPhone":"(301) 702-3810 ext 84137",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.5307795852,
        "offersDelivery":false,
        "openingHours":{
          "4th thursday of the month":{
            "open":"15:00",
            "close":"06:00"
          }
        },
        "specialNotes":"Limited to families of the IHS at Largo"
      },
      {
        "name":"Gaithersburg HELP",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"301 Muddy Branch Road Gaithersburg MD 20878",
        "latitude":39.1291834904,
        "longitude":-77.2078470962,
        "contactPhone":"(301) 216-2510",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":17.4009151868,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"17:00",
            "close":"18:30"
          },
          "tuesday":{
            "open":"17:00",
            "close":"18:30"
          },
          "wednesday":{
            "open":"17:00",
            "close":"18:30"
          },
          "thursday":{
            "open":"17:00",
            "close":"18:30"
          },
          "friday":{
            "open":"17:00",
            "close":"18:30"
          }
        },
        "specialNotes":"We require identification and proof of residence. We serve any resident in our service area. A service area map is available on our website at www.gaithersburghelp.org."
      },
      {
        "name":"Annandale UMC",
        "description":"Pre-bagged or boxed groceries",
        "address":"7901 Heritage Drive Annandale VA 22003",
        "latitude":38.8252541427,
        "longitude":-77.213292439,
        "contactPhone":"(703) 217-2514",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":18.6682008006,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"16:00",
            "close":"18:30"
          }
        },
        "specialNotes":"Photo ID and proof of residency in 22003 ZIPcode. One food pickup per week per household."
      },
      {
        "name":"NW Community Food",
        "description":"Loose groceries,Pre-bagged or boxed groceries,Prepared meals",
        "address":"4225 Connecticut AVE NW Washington DC DC 20008",
        "latitude":38.94390235,
        "longitude":-77.0629707071,
        "contactPhone":"(202) 594-0399",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":7.4316803625,
        "offersDelivery":true,
        "openingHours":{
          "sunday":{
            "open":"13:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Code 3 Association",
        "description":"Loose groceries",
        "address":"2929 Graham Road Falls Church VA 22042",
        "latitude":38.87122,
        "longitude":-77.19074,
        "contactPhone":"(703) 400-2118",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":15.8696448136,
        "offersDelivery":false,
        "openingHours":{
          "1st, 2nd, and 3rd saturday of the month":{
            "open":"11:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First Alliance Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"14500 New Hampshire Ave Silver Spring MD 20904",
        "latitude":39.07574585,
        "longitude":-77.00205455,
        "contactPhone":"(301) 785-8571",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":6.8730742919,
        "offersDelivery":false,
        "openingHours":{
          "2nd saturday of the month":{
            "open":"09:30",
            "close":"11:30"
          }
        },
        "specialNotes":"This is our drive thru event in the church parking lot."
      },
      {
        "name":"First Alliance Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"14500 New Hampshire Ave Silver Spring MD 20904",
        "latitude":39.07574585,
        "longitude":-77.00205455,
        "contactPhone":"(301) 785-8571",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":6.8730742919,
        "offersDelivery":false,
        "openingHours":{
          "4th tuesday of the month":{
            "open":"18:00",
            "close":"20:00"
          }
        },
        "specialNotes":"This is our indoor walk-in food pantry.  Please bring your own bags."
      },
      {
        "name":"St. Matthews Ken Jackson Food Closet",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"8617 Little River Turnpike Annandale VA 22003",
        "latitude":38.8334545082,
        "longitude":-77.214173289,
        "contactPhone":"(703) 978-3500",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":18.3664620331,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"17:00",
            "close":"18:30"
          },
          "friday":{
            "open":"09:00",
            "close":"10:30"
          }
        },
        "specialNotes":"Distribution at door 3, Far left from front of church"
      },
      {
        "name":"Grace Baptist Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"3121 Trinity Drive Bowie MD 20715",
        "latitude":38.9750465,
        "longitude":-76.7470449,
        "contactPhone":"(301) 262-1767",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":10.2952783623,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"11:30"
          }
        },
        "specialNotes":"Participants must register for an appointment. We currently have a waitlist for new clients."
      },
      {
        "name":"Ports Town Church",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"4500 57th Ave Bladensburg MD 20717",
        "latitude":38.9455463,
        "longitude":-76.9174457927,
        "contactPhone":"(301) 525-6328",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.2407953502,
        "offersDelivery":false,
        "openingHours":{
          "1st monday of the month":{
            "open":"18:00",
            "close":"21:00"
          },
          "3rd sunday of the month":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":"We will have boxes of non-perishable items available"
      },
      {
        "name":"Christ4Crisis",
        "description":"Loose groceries",
        "address":"14339 Richmond Highway Woodbridge VA 22191",
        "latitude":38.64098,
        "longitude":-77.26599,
        "contactPhone":"(571) 398-7826",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":29.8783488898,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Peters in the Woods",
        "description":"Pre-bagged or boxed groceries",
        "address":"5911 Fairview Woods Drive Fairfax Station VA 22039",
        "latitude":38.7970591,
        "longitude":-77.327289107,
        "contactPhone":"(703) 503-9210",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":24.8169317441,
        "offersDelivery":false,
        "openingHours":{
          "1st saturday of the month":{
            "open":"11:00",
            "close":"11:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Gaithersburg Soup Kitchen",
        "description":"Loose groceries,Pre-bagged or boxed groceries",
        "address":"9008 Rosemont Drive Gaithersburg MD 20877",
        "latitude":39.1272669,
        "longitude":-77.1858704301,
        "contactPhone":"(301) 926-0424",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":16.3550147081,
        "offersDelivery":false,
        "openingHours":{
          "sunday":{
            "open":"14:30",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Gaithersburg Soup Kitchen",
        "description":"Prepared meals",
        "address":"9008 Rosemont Drive Gaithersburg MD 20877",
        "latitude":39.1272669,
        "longitude":-77.1858704301,
        "contactPhone":"(301) 926-0424",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":16.3550147081,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"15:30",
            "close":"16:30"
          },
          "tuesday":{
            "open":"15:30",
            "close":"16:30"
          },
          "wednesday":{
            "open":"15:30",
            "close":"16:30"
          },
          "thursday":{
            "open":"15:30",
            "close":"16:30"
          },
          "friday":{
            "open":"15:30",
            "close":"16:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Centro de Apoyo Familiar (CAF)",
        "description":"Loose groceries",
        "address":"13923 Minnieville Road  Woodbridge VA 22193",
        "latitude":38.6696167942,
        "longitude":-77.286115112,
        "contactPhone":"(301) 328-3292",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":28.9931188804,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"16:30",
            "close":"18:30"
          },
          "saturday":{
            "open":"10:30",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mount Calvary Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"608 North Horners Lane Rockviille MD 20850",
        "latitude":39.09291,
        "longitude":-77.14419,
        "contactPhone":"(240) 351-7992",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":13.1730452743,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"13:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":"This distribution is operated by Nourish Now, although held at Mt. Calvary Baptist Church."
      },
      {
        "name":"Mount Calvary Baptist Church",
        "description":"Loose groceries",
        "address":"608 North Horners Lane Rockviille MD 20850",
        "latitude":39.09291,
        "longitude":-77.14419,
        "contactPhone":"(240) 351-7992",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":13.1730452743,
        "offersDelivery":false,
        "openingHours":{
          "1st and 3rd thursday of the month":{
            "open":"16:30",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":"Open 1st and 3rd Thursday of every month"
      },
      {
        "name":"American University",
        "description":"Loose groceries",
        "address":"4400 Massachusetts Ave Washington  DC 20016",
        "latitude":38.9387795,
        "longitude":-77.0863656,
        "contactPhone":"(305) 766-5993",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":8.7224882721,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"12:00",
            "close":"19:00"
          },
          "wednesday":{
            "open":"12:00",
            "close":"19:00"
          },
          "friday":{
            "open":"11:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"CFH Inc.",
        "description":"Loose groceries",
        "address":"9021 Centreville Road Manassas VA 20110",
        "latitude":38.7590755349,
        "longitude":-77.4626493488,
        "contactPhone":"(571) 201-6226",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":32.4188115197,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"15:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"15:00",
            "close":"17:00"
          }
        },
        "specialNotes":"For Residents of East End Mobile Home Park"
      },
      {
        "name":"University of District of Columbia",
        "description":"Loose groceries",
        "address":"4250 Connecticut Ave NW Washington DC DC 20008",
        "latitude":38.9444744,
        "longitude":-77.064239,
        "contactPhone":"(202) 603-5090",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.476755993,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"11:00",
            "close":"19:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"19:00"
          },
          "wednesday":{
            "open":"14:00",
            "close":"19:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"19:00"
          },
          "friday":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Student ID Required for Entry"
      },
      {
        "name":"St. John's Community Service Center",
        "description":"",
        "address":"7611 Little River Turnpike Annandale VA 22003",
        "latitude":38.8322740771,
        "longitude":-77.2081090636,
        "contactPhone":"(571) 283-9231",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":18.1525636848,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"16:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"16:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"13:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"16:00"
          },
          "friday":{
            "open":"10:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"True Ground Housing",
        "description":"Loose groceries",
        "address":"4318 N Carlin Springs Road Arlington VA 22203",
        "latitude":38.8775698741,
        "longitude":-77.1121943936,
        "contactPhone":"(571) 733-9627",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":12.160549783,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"18:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"18:00"
          },
          "wednesday":{
            "open":"08:00",
            "close":"13:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"18:00"
          },
          "friday":{
            "open":"10:00",
            "close":"13:00"
          },
          "saturday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Living Faith Lutheran Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"1605 Veirs Mill Road Rockville MD 20851",
        "latitude":39.0768558021,
        "longitude":-77.1236242376,
        "contactPhone":"(301) 424-8622",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":11.6503955628,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"09:00",
            "close":"Until Food Runs Out"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Woodbridge Church of the Nazarene",
        "description":"Loose groceries",
        "address":"14001 Smoketown Road Woodbridge VA 22193",
        "latitude":38.64483,
        "longitude":-77.30078,
        "contactPhone":"(703) 670-2252",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":30.8162088872,
        "offersDelivery":false,
        "openingHours":{
          "2nd and 4th tuesday of the month":{
            "open":"18:30",
            "close":"20:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"DC Doors",
        "description":"Prepared meals",
        "address":"900 Rhode Island Ave NW Washington DC 20018",
        "latitude":38.9116360356,
        "longitude":-77.0234148691,
        "contactPhone":"(202) 248-2098",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":7.0891657705,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:30",
            "close":"16:30"
          },
          "tuesday":{
            "open":"09:30",
            "close":"16:30"
          },
          "wednesday":{
            "open":"09:30",
            "close":"16:30"
          },
          "thursday":{
            "open":"09:30",
            "close":"16:30"
          },
          "friday":{
            "open":"07:00",
            "close":"22:00"
          },
          "saturday":{
            "open":"09:30",
            "close":"16:30"
          },
          "sunday":{
            "open":"07:00",
            "close":"22:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Holy Family Catholic Church Food Pantry",
        "description":"Pre-bagged or boxed groceries",
        "address":"14160 Ferndale Road Dale City VA 22193",
        "latitude":38.64643,
        "longitude":-77.32125,
        "contactPhone":"(703) 459-7156",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":31.4428794936,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"16:00",
            "close":"17:30"
          },
          "wednesday":{
            "open":"16:00",
            "close":"17:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Sacred Heart Catholic Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"12975 Purcell Road Manassas VA 20112",
        "latitude":38.67514,
        "longitude":-77.39712,
        "contactPhone":"(703) 590-0030",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":32.9173344721,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"08:00",
            "close":"09:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Manassas Baptist Church",
        "description":"Pre-bagged or boxed groceries",
        "address":"8730 Sudley Road Manassas VA 20110",
        "latitude":38.76556045,
        "longitude":-77.4838594553,
        "contactPhone":"(703) 361-2146",
        "contactEmail":"",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":33.2045884583,
        "offersDelivery":false,
        "openingHours":{
          "1st and 3rd wednesday of the month":{
            "open":"17:00",
            "close":"20:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Washington View Apartments",
        "description":"Loose groceries",
        "address":"2629 Douglass Rd SE Washington DC DC 20020",
        "latitude":38.85707,
        "longitude":-76.98951,
        "contactPhone":"(202) 621-1600",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":9.576237894,
        "offersDelivery":false,
        "openingHours":{
          "1st and 4th saturday of the month":{
            "open":"12:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Inova Cares Clinics",
        "description":"Pre-bagged or boxed groceries",
        "address":"6400 Arlington Blvd Falls Church VA 22042",
        "latitude":38.8683837823,
        "longitude":-77.182693042,
        "contactPhone":"(703) 698-2552",
        "contactEmail":"",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":15.6053256663,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"08:00",
            "close":"16:30"
          },
          "tuesday":{
            "open":"08:00",
            "close":"16:30"
          },
          "wednesday":{
            "open":"08:00",
            "close":"16:30"
          },
          "thursday":{
            "open":"08:00",
            "close":"16:30"
          },
          "friday":{
            "open":"08:00",
            "close":"16:30"
          },
          "saturday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":"Must be a patient"
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
      },
      {
        userId: 1,
        pantryId: 3,
        rating: 4,
        comment: "I enjoyed my experience here. Some of the produce was bad but the staff were friendly and helpful!",
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
