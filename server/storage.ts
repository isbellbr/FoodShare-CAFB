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
        "name":"Abundant Life II",
        "description":"",
        "address":"5110 Balto Natt Pike apt 4",
        "latitude":39.2866,
        "longitude":-76.7007,
        "contactPhone":"(410) 947-6343",
        "contactEmail":"Thomas Hill",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.2292752613,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Adams Chapel AME",
        "description":"",
        "address":"3813 Egerton Rd.",
        "latitude":39.3337,
        "longitude":-76.6897,
        "contactPhone":"(410) 542-6200",
        "contactEmail":"Arlean Burton",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.0102990099,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"13:00"
          },
          "saturday":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Agape House",
        "description":"",
        "address":"222 N. Carrollton Ave.",
        "latitude":39.2912,
        "longitude":-76.6447,
        "contactPhone":"(410) 728-2222",
        "contactEmail":"Rev. Robinson",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":1.3320178286,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"12:00",
            "close":"18:00"
          },
          "saturday":{
            "open":"12:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"AMES Memorial AME",
        "description":"",
        "address":"615 Baker St.",
        "latitude":39.3086,
        "longitude":-76.6334,
        "contactPhone":"(410) 523-5556",
        "contactEmail":"Jacqueline Johnson",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":1.8241659471,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Bernard E. Mason",
        "description":"",
        "address":"2121 Windsor Gardens",
        "latitude":39.3153,
        "longitude":-76.6932,
        "contactPhone":"(410) 448-1311",
        "contactEmail":"Liflie Ziegler",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":4.3991026707,
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
        "name":"Bethany Baptist Church",
        "description":"",
        "address":"2616 Ridgeley St.",
        "latitude":39.2735,
        "longitude":-76.6562,
        "contactPhone":"(410) 539-5029",
        "contactEmail":"Sanra White",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.977685598,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"12:00"
          },
          "tuesday":{
            "open":"09:00",
            "close":"12:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"12:00"
          },
          "thursday":{
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
        "name":"Bethel Church of God",
        "description":"",
        "address":"301 W. 28th Street",
        "latitude":39.3214,
        "longitude":-76.6219,
        "contactPhone":"(410) 235-0160",
        "contactEmail":"Charletta Williams",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.597959957,
        "offersDelivery":true,
        "openingHours":{
          "friday":{
            "open":"09:00",
            "close":"15:00"
          },
          "sunday":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Carter Memorial Emergency",
        "description":"",
        "address":"745 West Fayette St.",
        "latitude":39.2904,
        "longitude":-76.6278,
        "contactPhone":"(410) 752-6123",
        "contactEmail":"Verner Lewis",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":0.5606875152,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Central Baptist Church",
        "description":"",
        "address":"2035 West Baltimore St",
        "latitude":39.287,
        "longitude":-76.6447,
        "contactPhone":"(410) 233-8558",
        "contactEmail":"Rev. Matthew Braxton",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.249729579,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Chase House",
        "description":"",
        "address":"1027 Cathedral St",
        "latitude":39.3002,
        "longitude":-76.6166,
        "contactPhone":"(410) 539-6155",
        "contactEmail":"Joan Weston",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.1654989882,
        "offersDelivery":true,
        "openingHours":{
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Christ Deliverance Church",
        "description":"",
        "address":"711 Walnut Ave.",
        "latitude":39.2865,
        "longitude":-76.6919,
        "contactPhone":"(410) 945-8700",
        "contactEmail":"Rev. Martin Jacobs",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.7588670082,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"12:00",
            "close":"18:00"
          },
          "wednesday":{
            "open":"12:00",
            "close":"18:00"
          },
          "friday":{
            "open":"12:00",
            "close":"18:00"
          },
          "saturday":{
            "open":"12:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Christian Memorial Church",
        "description":"",
        "address":"2001 West North Ave.",
        "latitude":39.3093,
        "longitude":-76.6447,
        "contactPhone":"(410) 728-0464",
        "contactEmail":"Barbara Grimes",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.1486614526,
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
        "name":"Church Of Jesus Christ",
        "description":"",
        "address":"2880 Hillen Road",
        "latitude":39.3235,
        "longitude":-76.5897,
        "contactPhone":"(410) 366-8010",
        "contactEmail":"James Gamble",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":3.2328554051,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"15:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Claremont Homes",
        "description":"",
        "address":"4312 Clareway",
        "latitude":39.3018,
        "longitude":-76.5671,
        "contactPhone":"(410) 485-4836",
        "contactEmail":"Anna Warren",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.1734964983,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Collington Square",
        "description":"",
        "address":"1211 N. Chester St",
        "latitude":39.3046,
        "longitude":-76.5826,
        "contactPhone":"(410) 342-6740",
        "contactEmail":"Gloria Etheridge",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.537067895,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"12:00",
            "close":"04:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Concord Baptist Church",
        "description":"4th Saturday only",
        "address":"5204 Liberty Heights Ave.",
        "latitude":39.3318,
        "longitude":-76.6947,
        "contactPhone":"(410) 367-1117",
        "contactEmail":"Hazel Guin",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.1215673343,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"11:30"
          }
        },
        "specialNotes":"4th Saturday only"
      },
      {
        "name":"Corpus Christi",
        "description":"",
        "address":"703 Whitelock St.",
        "latitude":39.3137,
        "longitude":-76.6335,
        "contactPhone":"(410) 523-5822",
        "contactEmail":"Mariano",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":2.1601093461,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"13:30",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Deliverance Manna",
        "description":"",
        "address":"3538 Old York Road",
        "latitude":39.3287,
        "longitude":-76.6096,
        "contactPhone":"(410) 947-4536",
        "contactEmail":"Jerry Wallace",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":3.1690538269,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"10:00",
            "close":"20:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"20:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Dept of Housing Neighborhood",
        "description":"",
        "address":"22 S. Calhoun",
        "latitude":39.2878,
        "longitude":-76.6447,
        "contactPhone":"(410) 566-6658",
        "contactEmail":"Deinia",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":1.2606763833,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Donald Bentley Food Pantry",
        "description":"",
        "address":"2405 Loch Raven Blvd.",
        "latitude":39.3187,
        "longitude":-76.5901,
        "contactPhone":"(410) 662-9287",
        "contactEmail":"Ellen Bentley",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.9443773157,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Dukeland Development",
        "description":"",
        "address":"1601 Gertrude St.",
        "latitude":39.3073,
        "longitude":-76.6654,
        "contactPhone":"(410) 233-6112",
        "contactEmail":"Hallie Rhames",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.8454458488,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"12:00",
            "close":"20:00"
          },
          "friday":{
            "open":"12:00",
            "close":"20:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"East Baltimore Church of God",
        "description":"",
        "address":"800 South Oldham St",
        "latitude":39.2841,
        "longitude":-76.5671,
        "contactPhone":"(410) 327-0177",
        "contactEmail":"Welton Hunt",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.9200840115,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"15:00"
          },
          "sunday":{
            "open":"10:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Emergency Food Relief Fund",
        "description":"",
        "address":"1401 Pennsylvania Ave.",
        "latitude":39.3043,
        "longitude":-76.6347,
        "contactPhone":"(410) 523-7000",
        "contactEmail":"Leslie Wood",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":1.5778120891,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"11:30",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First Apostolic Faith Church",
        "description":"",
        "address":"27 S. Caroline St.",
        "latitude":39.2886,
        "longitude":-76.5944,
        "contactPhone":"(410) 327-1181",
        "contactEmail":"Beatrice Bridgefort",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.4971543527,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"14:30",
            "close":"16:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First Charity Baptist Church",
        "description":"",
        "address":"611 N. Aisquith St",
        "latitude":39.2967,
        "longitude":-76.6046,
        "contactPhone":"(410) 732-0076",
        "contactEmail":"Rebecca Pugh",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":1.2769558186,
        "offersDelivery":true,
        "openingHours":{
          "friday":{
            "open":"11:00",
            "close":"15:00"
          },
          "saturday":{
            "open":"11:00",
            "close":"15:00"
          },
          "sunday":{
            "open":"11:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First Emmanuel Baptist Church",
        "description":"",
        "address":"2209 Park Ave",
        "latitude":39.3125,
        "longitude":-76.6284,
        "contactPhone":"(410) 523-6787",
        "contactEmail":"Bertha Creighton",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.0151003766,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"12:00",
            "close":"15:00"
          },
          "thursday":{
            "open":"12:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"First Philadelphia Baptist",
        "description":"",
        "address":"2120 Greenmount Ave.",
        "latitude":39.3133,
        "longitude":-76.6088,
        "contactPhone":"(410) 243-5625",
        "contactEmail":"Lucy Washington",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.1518181838,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"10:30",
            "close":"12:30"
          },
          "friday":{
            "open":"10:30",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Franciscan Center, Inc.",
        "description":"",
        "address":"2212 Maryland Ave.",
        "latitude":39.3143,
        "longitude":-76.6174,
        "contactPhone":"(410) 467-5340",
        "contactEmail":"Brother Finbar",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.119874651,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          },
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Gospel Messenger",
        "description":"",
        "address":"2610 Keyworth Ave.",
        "latitude":39.3305,
        "longitude":-76.6612,
        "contactPhone":"(410) 467-0113",
        "contactEmail":"Rev. Geraldine S. James",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":3.8563056263,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"09:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Gospel Tabernacle",
        "description":"",
        "address":"3100 Walbrook Ave.",
        "latitude":39.3097,
        "longitude":-76.6654,
        "contactPhone":"(410) 299-9919",
        "contactEmail":"Lillian Royster",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.9431920721,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"11:00",
            "close":"15:00"
          },
          "friday":{
            "open":"11:00",
            "close":"15:00"
          },
          "sunday":{
            "open":"11:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Grace Memorial",
        "description":"",
        "address":"1100 N. Eden St",
        "latitude":39.3027,
        "longitude":-76.5897,
        "contactPhone":"(410) 563-2355",
        "contactEmail":"Rev. Irwin Pope",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.1525098155,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"12:00",
            "close":"13:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Greater Zion Church",
        "description":"",
        "address":"301 No. Gilmore Ave.",
        "latitude":39.2912,
        "longitude":-76.6447,
        "contactPhone":"(410) 788-0547",
        "contactEmail":"Rev. Amos Burgess",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.3320178286,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"13:00",
            "close":"16:00"
          },
          "friday":{
            "open":"13:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Greenhill Apts.",
        "description":"",
        "address":"2501 Violet Ave, #710 N.",
        "latitude":39.3305,
        "longitude":-76.6612,
        "contactPhone":"(410) 383-9171",
        "contactEmail":"Ethel Lee",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":3.8563056263,
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
        "name":"Hampden UMC",
        "description":"",
        "address":"3449 Falls Rd.",
        "latitude":39.3314,
        "longitude":-76.6334,
        "contactPhone":"(410) 243-1997",
        "contactEmail":"Elizabeth Green",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.3478322949,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"12:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Harford Senior Center",
        "description":"",
        "address":"4920 Harford Rd.",
        "latitude":39.3406,
        "longitude":-76.5671,
        "contactPhone":"(410) 426-4009",
        "contactEmail":"Jessie Martek",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.8909743665,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          },
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Harvest Christian",
        "description":"",
        "address":"2601 Pennsylvania Ave.",
        "latitude":39.3125,
        "longitude":-76.6347,
        "contactPhone":"(410) 523-0143",
        "contactEmail":"Mary Coleman",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.1012982828,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Harvey Johnson Towers",
        "description":"",
        "address":"1510 WE. Mosher St.",
        "latitude":39.3018,
        "longitude":-76.6378,
        "contactPhone":"(410) 462-6205",
        "contactEmail":"Juanita Leigh",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.5125994586,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Healthy Start",
        "description":"",
        "address":"610 N. Chester St.",
        "latitude":39.2967,
        "longitude":-76.5826,
        "contactPhone":"(410) 675-2125",
        "contactEmail":"Jacqueline Toppins",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.2729334375,
        "offersDelivery":false,
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
            "close":"16:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Healthy Start",
        "description":"",
        "address":"1622 N. Carey St.",
        "latitude":39.3073,
        "longitude":-76.6378,
        "contactPhone":"(410) 728-7539",
        "contactEmail":"Gloria Johnson",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.8378147332,
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
            "close":"16:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Helping Hands Food Pantry",
        "description":"",
        "address":"1911 Belair Rd.",
        "latitude":39.3133,
        "longitude":-76.5826,
        "contactPhone":"(410) 342-1310",
        "contactEmail":"Rosalie Branch",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.9198146602,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Hills Memorial",
        "description":"",
        "address":"3939 Reisterstown Rd.",
        "latitude":39.3318,
        "longitude":-76.6818,
        "contactPhone":"(410) 396-7740",
        "contactEmail":"Rev. Helen Samuel",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.6176843324,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"13:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"13:00"
          },
          "friday":{
            "open":"09:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Homestead UMC",
        "description":"",
        "address":"1500 Gorsuch Ave.",
        "latitude":39.3287,
        "longitude":-76.6088,
        "contactPhone":"(410) 243-4419",
        "contactEmail":"Shirley Dean",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":3.1780604191,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"11:30",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Household of Faith Missionary",
        "description":"",
        "address":"4811 Belair Rd.",
        "latitude":39.3318,
        "longitude":-76.5516,
        "contactPhone":"(410) 485-5375",
        "contactEmail":"Rev. Harrison Geter",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.0044321799,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Human Services Division-4th",
        "description":"",
        "address":"1133 Pennsylvania Ave.",
        "latitude":39.2994,
        "longitude":-76.6347,
        "contactPhone":"(410) 396-0893",
        "contactEmail":"Josephine Battaglia",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.2825962085,
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
          "thursday":{
            "open":"09:00",
            "close":"15:00"
          },
          "friday":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Israel Baptist Outreach",
        "description":"Different hours Wed/Fri",
        "address":"1211 N. Chester St.",
        "latitude":39.3046,
        "longitude":-76.5826,
        "contactPhone":"(410) 732-3494",
        "contactEmail":"Shirley Eaddy",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.537067895,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"11:00",
            "close":"19:00"
          },
          "tuesday":{
            "open":"11:00",
            "close":"19:00"
          },
          "wednesday":{
            "open":"11:00",
            "close":"19:00"
          },
          "thursday":{
            "open":"11:00",
            "close":"19:00"
          },
          "friday":{
            "open":"11:00",
            "close":"19:00"
          }
        },
        "specialNotes":"Different hours Wed/Fri"
      },
      {
        "name":"JB Outreach Ministries",
        "description":"2nd & 4th Thursday only",
        "address":"301 N. Stricker St",
        "latitude":39.2912,
        "longitude":-76.6447,
        "contactPhone":"(410) 644-5822",
        "contactEmail":"James Bivens",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.3320178286,
        "offersDelivery":false,
        "openingHours":{
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":"2nd & 4th Thursday only"
      },
      {
        "name":"Jesus Saving Ministries",
        "description":"",
        "address":"1625 N. Hilton St.",
        "latitude":39.3073,
        "longitude":-76.6654,
        "contactPhone":"(410) 362-1911",
        "contactEmail":"Barbara Davis",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.8454458488,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"12:00",
            "close":"13:00"
          },
          "thursday":{
            "open":"12:00",
            "close":"13:00"
          },
          "friday":{
            "open":"12:00",
            "close":"13:00"
          },
          "saturday":{
            "open":"12:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Johnston Square Community",
        "description":"",
        "address":"841 E. Chase St",
        "latitude":39.3018,
        "longitude":-76.6046,
        "contactPhone":"(410) 685-5950",
        "contactEmail":"Margaret Hawkes",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.543660892,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"13:00",
            "close":"16:00"
          },
          "tuesday":{
            "open":"13:00",
            "close":"16:00"
          },
          "wednesday":{
            "open":"13:00",
            "close":"16:00"
          },
          "thursday":{
            "open":"13:00",
            "close":"16:00"
          },
          "friday":{
            "open":"13:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Jonah House",
        "description":"",
        "address":"1301 Moreland Ave.",
        "latitude":39.3043,
        "longitude":-76.6654,
        "contactPhone":"(410) 233-6238",
        "contactEmail":"Susan Crane",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.732513294,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"07:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Judah Worship Center",
        "description":"",
        "address":"2000 Frederick Ave.",
        "latitude":39.2841,
        "longitude":-76.6447,
        "contactPhone":"(410) 466-5729",
        "contactEmail":"Pastor Morton",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.2302156836,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Laurens House",
        "description":"",
        "address":"1330 Laurens St.",
        "latitude":39.3043,
        "longitude":-76.6378,
        "contactPhone":"(410) 728-5515",
        "contactEmail":"Rosalie",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.6575365953,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"13:00",
            "close":"18:00"
          },
          "wednesday":{
            "open":"13:00",
            "close":"18:00"
          },
          "friday":{
            "open":"13:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Lexington Poe",
        "description":"",
        "address":"206 N. Fremont Ave.",
        "latitude":39.2912,
        "longitude":-76.6316,
        "contactPhone":"(410) 396-0936",
        "contactEmail":"Lorraine Ledbetter",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":0.7360131692,
        "offersDelivery":true,
        "openingHours":{
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
          },
          "friday":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Love of God",
        "description":"",
        "address":"321 N. Fulton St.",
        "latitude":39.2878,
        "longitude":-76.6378,
        "contactPhone":"(410) 362-2232",
        "contactEmail":"Bettie Williams",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":0.904276072,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Macedonia Baptist Church",
        "description":"",
        "address":"718 W. Lafayette St.",
        "latitude":39.3018,
        "longitude":-76.6347,
        "contactPhone":"(410) 669-5776",
        "contactEmail":"Gladys Augustus",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.4247846625,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Manna Ministry of Greater Gethsemane",
        "description":"",
        "address":"2511 E. Preston St.",
        "latitude":39.3058,
        "longitude":-76.5826,
        "contactPhone":"(410) 675-2267",
        "contactEmail":"Bertha Bell",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":2.5849237694,
        "offersDelivery":true,
        "openingHours":{
          "thursday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Maryland Church of God",
        "description":"",
        "address":"5100 Denmore Ave.",
        "latitude":39.3406,
        "longitude":-76.6818,
        "contactPhone":"(410) 367-2768",
        "contactEmail":"Ethel Lee",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.0719303818,
        "offersDelivery":true,
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
            "close":"17:00"
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
        "name":"Mason Memorial",
        "description":"",
        "address":"2608 Frederick Ave.",
        "latitude":39.2841,
        "longitude":-76.6562,
        "contactPhone":"(410) 947-4466",
        "contactEmail":"Mary Curtis",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":1.8451779904,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Metropolitan Church Pantry",
        "description":"",
        "address":"4815 Eastern Ave.",
        "latitude":39.2878,
        "longitude":-76.5516,
        "contactPhone":"(410) 633-5516",
        "contactEmail":"Grace Weber",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.7590259061,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"09:00",
            "close":"10:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mount Moriah Baptist Church",
        "description":"",
        "address":"2201 Garrison Blvd.",
        "latitude":39.3097,
        "longitude":-76.6654,
        "contactPhone":"(410) 945-3575",
        "contactEmail":"Wilhelmina Davis",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.9431920721,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"08:30",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mt Pleasant Church",
        "description":"",
        "address":"6000 Radecke Ave.",
        "latitude":39.3406,
        "longitude":-76.5516,
        "contactPhone":"(410) 325-3080",
        "contactEmail":"Aretha Allen",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":5.4263562761,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Mt. Tabor Baptist",
        "description":"",
        "address":"1719 E. Oliver St.",
        "latitude":39.3073,
        "longitude":-76.5897,
        "contactPhone":"(410) 327-1740",
        "contactEmail":"Rev. Forrest",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.3588611381,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Fellowship Christian Community",
        "description":"",
        "address":"5202 Park Heights Ave.",
        "latitude":39.3406,
        "longitude":-76.6818,
        "contactPhone":"(410) 367-5766",
        "contactEmail":"Ann Quarles",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.0719303818,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"09:00",
            "close":"12:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Gabriel Baptist Church",
        "description":"",
        "address":"1041 Wilmington Ave.",
        "latitude":39.2841,
        "longitude":-76.6447,
        "contactPhone":"(410) 840-3363",
        "contactEmail":"Rev. Dykes",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.2302156836,
        "offersDelivery":false,
        "openingHours":{
          "sunday":{
            "open":"08:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Hope Church of God",
        "description":"",
        "address":"6601 Cleveland Ave.",
        "latitude":39.3097,
        "longitude":-76.5361,
        "contactPhone":"(410) 282-2219",
        "contactEmail":"Cynthia",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":4.9144556496,
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
            "open":"10:00",
            "close":"18:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"18:00"
          },
          "friday":{
            "open":"10:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Life Evangelical Baptist",
        "description":"",
        "address":"2417 E. North Ave.",
        "latitude":39.3125,
        "longitude":-76.5826,
        "contactPhone":"(410) 675-2178",
        "contactEmail":"Rev. Williams",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.881508365,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"16:00"
          },
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
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Life Fellowship",
        "description":"",
        "address":"559 Robert St.",
        "latitude":39.3018,
        "longitude":-76.6347,
        "contactPhone":"(410) 466-7306",
        "contactEmail":"Rita Yarborough",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.4247846625,
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
        "name":"New Mount Zion Baptist Church",
        "description":"",
        "address":"817 N. Mount St.",
        "latitude":39.2994,
        "longitude":-76.6447,
        "contactPhone":"(410) 523-9082",
        "contactEmail":"Peggy Mitchell",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.6353805619,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"12:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"12:00"
          },
          "friday":{
            "open":"10:00",
            "close":"12:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Shiloh Baptist Church",
        "description":"",
        "address":"2100 N. Monroe St.",
        "latitude":39.3097,
        "longitude":-76.6447,
        "contactPhone":"(410) 523-5306",
        "contactEmail":"Sue Wilson",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.1713799088,
        "offersDelivery":true,
        "openingHours":{
          "saturday":{
            "open":"13:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"New Zion Hill Baptist",
        "description":"",
        "address":"2432 E. North Ave.",
        "latitude":39.3125,
        "longitude":-76.5826,
        "contactPhone":"(410) 558-0950",
        "contactEmail":"Pastor Barnes",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":2.881508365,
        "offersDelivery":true,
        "openingHours":{
          "friday":{
            "open":"10:00",
            "close":"13:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"North Baltimore CARES",
        "description":"",
        "address":"5502 York Rd.",
        "latitude":39.3406,
        "longitude":-76.6088,
        "contactPhone":"(410) 433-2442",
        "contactEmail":"Barbara Metz",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":3.9846728504,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"11:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Oaks at Liberty",
        "description":"",
        "address":"3501 Howard Park",
        "latitude":39.3223,
        "longitude":-76.6932,
        "contactPhone":"(410) 466-9267",
        "contactEmail":"Kimberly White",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.6572415972,
        "offersDelivery":true,
        "openingHours":{
          "friday":{
            "open":"14:00",
            "close":"16:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Park Heights Community Center",
        "description":"",
        "address":"4917 Park Heights Ave.",
        "latitude":39.3406,
        "longitude":-76.6818,
        "contactPhone":"(410) 578-1800",
        "contactEmail":"Shirley Oliver",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":5.0719303818,
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
        "name":"Paul's Place Outreach Center",
        "description":"",
        "address":"1118 Ward St.",
        "latitude":39.2783,
        "longitude":-76.6316,
        "contactPhone":"(410) 625-0775",
        "contactEmail":"Bill McLiman",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":0.6517333994,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"08:30",
            "close":"11:00"
          },
          "tuesday":{
            "open":"08:30",
            "close":"11:00"
          },
          "wednesday":{
            "open":"08:30",
            "close":"11:00"
          },
          "thursday":{
            "open":"08:30",
            "close":"11:00"
          },
          "friday":{
            "open":"08:30",
            "close":"11:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Payne Memorial Church",
        "description":"",
        "address":"1714 Madison Ave.",
        "latitude":39.3073,
        "longitude":-76.6316,
        "contactPhone":"(410) 462-3800",
        "contactEmail":"Margaret Solomon",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.7078246848,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"People's Church of Baltimore",
        "description":"",
        "address":"230 N. Fulton Ave.",
        "latitude":39.2912,
        "longitude":-76.6378,
        "contactPhone":"(410) 945-7923",
        "contactEmail":"Coretha Jones",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":1.0013586903,
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
        "name":"Perkins Square Baptist Church",
        "description":"",
        "address":"2500 Edmondson Ave.",
        "latitude":39.2929,
        "longitude":-76.6562,
        "contactPhone":"(410) 945-0445",
        "contactEmail":"Edythe Gregory",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.9491431078,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"14:00",
            "close":"17:00"
          },
          "tuesday":{
            "open":"14:00",
            "close":"17:00"
          },
          "wednesday":{
            "open":"14:00",
            "close":"17:00"
          },
          "thursday":{
            "open":"14:00",
            "close":"17:00"
          },
          "friday":{
            "open":"14:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Pillar of Truth",
        "description":"",
        "address":"2522 Greenmount Ave.",
        "latitude":39.3187,
        "longitude":-76.6088,
        "contactPhone":"(410) 243-1141",
        "contactEmail":"Lonnie Perry",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":2.5080847071,
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
          },
          "saturday":{
            "open":"09:00",
            "close":"17:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Pitts Outreach",
        "description":"",
        "address":"1142 N. Fulton Ave.",
        "latitude":39.3027,
        "longitude":-76.6378,
        "contactPhone":"(410) 728-8782",
        "contactEmail":"Rose Long",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.5641265711,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"14:30",
            "close":"15:00"
          },
          "thursday":{
            "open":"14:30",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Pleasant Grove Food",
        "description":"",
        "address":"214 S. Loudon Ave.",
        "latitude":39.2841,
        "longitude":-76.6819,
        "contactPhone":"(410) 646-1462",
        "contactEmail":"Charlotte",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":3.2195654077,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Pleasant View Gardens",
        "description":"",
        "address":"201 N. Aisquith St.",
        "latitude":39.2912,
        "longitude":-76.6046,
        "contactPhone":"(410) 396-9006",
        "contactEmail":"Darrel Roaster",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.047695293,
        "offersDelivery":false,
        "openingHours":{
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Poppleton Co-op",
        "description":"",
        "address":"838 W. Fairmont Ave.",
        "latitude":39.2886,
        "longitude":-76.6316,
        "contactPhone":"(410) 532-1517",
        "contactEmail":"Jackie Brown",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":0.6247357088,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"11:00",
            "close":"15:00"
          },
          "tuesday":{
            "open":"11:00",
            "close":"15:00"
          },
          "wednesday":{
            "open":"11:00",
            "close":"15:00"
          },
          "thursday":{
            "open":"11:00",
            "close":"15:00"
          },
          "friday":{
            "open":"11:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Prisoners Aid",
        "description":"",
        "address":"204 25th Street",
        "latitude":39.3187,
        "longitude":-76.6088,
        "contactPhone":"(410) 662-0359",
        "contactEmail":"Michael Brown",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.5080847071,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"18:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Quality of Life Corp",
        "description":"",
        "address":"2630 Harford Rd.",
        "latitude":39.3187,
        "longitude":-76.5826,
        "contactPhone":"(410) 235-3972",
        "contactEmail":"Ismenda Hendrix",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":3.1914235848,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Ray of Hope",
        "description":"",
        "address":"3501 Parkside Dr.",
        "latitude":39.3406,
        "longitude":-76.5205,
        "contactPhone":"(410) 661-9428",
        "contactEmail":"George Crutchfield",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":6.6835699921,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Refuge Way of Cross Church",
        "description":"",
        "address":"4301 Old York Rd.",
        "latitude":39.3406,
        "longitude":-76.6088,
        "contactPhone":"(410) 435-8339",
        "contactEmail":"Frances Wellborn",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.9846728504,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"12:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Royal Light Outreach",
        "description":"",
        "address":"1562 N. Fulton Ave.",
        "latitude":39.3058,
        "longitude":-76.6378,
        "contactPhone":"(410) 566-2940",
        "contactEmail":"Al Lawson",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":1.746926957,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"11:00",
            "close":"13:00"
          },
          "thursday":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Salvation Army",
        "description":"",
        "address":"814 Light St",
        "latitude":39.2783,
        "longitude":-76.6121,
        "contactPhone":"(410) 787-2920",
        "contactEmail":"Crystal White",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":0.6387670657,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"08:30",
            "close":"12:00"
          },
          "tuesday":{
            "open":"08:30",
            "close":"12:00"
          },
          "wednesday":{
            "open":"08:30",
            "close":"12:00"
          },
          "thursday":{
            "open":"08:30",
            "close":"12:00"
          },
          "friday":{
            "open":"08:30",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Sharon Baptist",
        "description":"3rd Saturday only",
        "address":"1373 N. Stricker St.",
        "latitude":39.3046,
        "longitude":-76.6447,
        "contactPhone":"(410) 669-6667",
        "contactEmail":"Elaine Brown Page",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":1.8915545957,
        "offersDelivery":false,
        "openingHours":{
          "saturday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":"3rd Saturday only"
      },
      {
        "name":"Second Shiloh",
        "description":"",
        "address":"1355 Homestead St",
        "latitude":39.3257,
        "longitude":-76.6088,
        "contactPhone":"(410) 366-1025",
        "contactEmail":"Wanda Hudson",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.9760612255,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"11:00",
            "close":"13:00"
          },
          "wednesday":{
            "open":"11:00",
            "close":"13:00"
          },
          "thursday":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Solomon Temple Baptist Church",
        "description":"",
        "address":"1738 Appleton Street",
        "latitude":39.3073,
        "longitude":-76.6447,
        "contactPhone":"(410) 566-2105",
        "contactEmail":"Rev. Thomas Sledge",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.0368941688,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          },
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Southwest Emergency Food Program",
        "description":"",
        "address":"31 S. Payson St",
        "latitude":39.2878,
        "longitude":-76.6447,
        "contactPhone":"(410) 396-1740",
        "contactEmail":"Eugene Holt",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.2606763833,
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
          "thursday":{
            "open":"09:00",
            "close":"15:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"South Baltimore Emergency",
        "description":"",
        "address":"110 E. West St",
        "latitude":39.2783,
        "longitude":-76.6121,
        "contactPhone":"(410) 752-1336",
        "contactEmail":"Elizabeth Baer",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":0.6387670657,
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
          },
          "thursday":{
            "open":"10:00",
            "close":"13:00"
          },
          "friday":{
            "open":"10:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Southwest Neighborhood Service Center",
        "description":"",
        "address":"3411 Bank St.",
        "latitude":39.2878,
        "longitude":-76.5671,
        "contactPhone":"(410) 545-6515",
        "contactEmail":"Carrene Bullard",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.9329838813,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Abraham Baptist Church",
        "description":"1st & 3rd Wednesday",
        "address":"1124 W. North Ave.",
        "latitude":39.3097,
        "longitude":-76.6378,
        "contactPhone":"(410) 383-6919",
        "contactEmail":"Rev. Clarence Yerby",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.9858354152,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"09:30",
            "close":"13:00"
          }
        },
        "specialNotes":"1st & 3rd Wednesday"
      },
      {
        "name":"St. Ambrose",
        "description":"",
        "address":"3445 Park Heights Ave.",
        "latitude":39.3318,
        "longitude":-76.6818,
        "contactPhone":"(410) 225-0870",
        "contactEmail":"Inez",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.6176843324,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"09:00",
            "close":"16:00"
          },
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
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Ann Outreach Ctr.",
        "description":"Different hours for Tue and Sat",
        "address":"528 E. 22nd St.",
        "latitude":39.3153,
        "longitude":-76.6088,
        "contactPhone":"(410) 235-8169",
        "contactEmail":"Sister Jean",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":2.2831415097,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"08:00",
            "close":"14:00"
          },
          "saturday":{
            "open":"08:00",
            "close":"14:00"
          }
        },
        "specialNotes":"Different hours for Tue and Sat"
      },
      {
        "name":"St. Bernadine's Catholic",
        "description":"",
        "address":"3812 Edmondson Ave.",
        "latitude":39.2929,
        "longitude":-76.6819,
        "contactPhone":"(410) 362-8664",
        "contactEmail":"Deacon Phil",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.2801225328,
        "offersDelivery":false,
        "openingHours":{
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
        "name":"St. Cecilia",
        "description":"",
        "address":"3300 Clifton Ave.",
        "latitude":39.3097,
        "longitude":-76.6689,
        "contactPhone":"(410) 624-3600",
        "contactEmail":"Robert Viner",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":3.0938636952,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Elizabeth Food Pantry",
        "description":"",
        "address":"2 N. Belnord Ave.",
        "latitude":39.2886,
        "longitude":-76.5671,
        "contactPhone":"(410) 675-8260",
        "contactEmail":"Lucy D'Pinto",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.9386912005,
        "offersDelivery":true,
        "openingHours":{
          "tuesday":{
            "open":"11:30",
            "close":"13:30"
          },
          "friday":{
            "open":"11:30",
            "close":"13:30"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Gregory the Great",
        "description":"",
        "address":"1542 N. Gilmore St.",
        "latitude":39.3058,
        "longitude":-76.6447,
        "contactPhone":"(410) 523-0061",
        "contactEmail":"Gloria Williams",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.9552864713,
        "offersDelivery":false,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"14:00"
          },
          "tuesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "wednesday":{
            "open":"10:00",
            "close":"14:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"14:00"
          },
          "friday":{
            "open":"10:00",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Luke Temple",
        "description":"Different hours for Tue and Fri",
        "address":"1821 N. Smallwood Street",
        "latitude":39.3073,
        "longitude":-76.6447,
        "contactPhone":"(410) 225-9409",
        "contactEmail":"Edna Evans",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":2.0368941688,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"17:00",
            "close":"21:00"
          },
          "friday":{
            "open":"17:00",
            "close":"21:00"
          }
        },
        "specialNotes":"Different hours for Tue and Fri"
      },
      {
        "name":"St. Mark's UMC/Bread of Life",
        "description":"",
        "address":"3900 Liberty Heights Ave.",
        "latitude":39.3318,
        "longitude":-76.6819,
        "contactPhone":"(410) 542-5338",
        "contactEmail":"Richard Wright",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.6214058832,
        "offersDelivery":true,
        "openingHours":{
          "wednesday":{
            "open":"17:30",
            "close":"19:00"
          },
          "friday":{
            "open":"17:30",
            "close":"19:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Michael Outreach",
        "description":"",
        "address":"1922 E. Lombard St.",
        "latitude":39.2912,
        "longitude":-76.5826,
        "contactPhone":"(410) 732-2176",
        "contactEmail":"Lisa Knickmeyer",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.1525690227,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"09:00",
            "close":"12:00"
          },
          "wednesday":{
            "open":"09:00",
            "close":"12:00"
          },
          "thursday":{
            "open":"09:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Paul Baptist Church",
        "description":"Extended hours Thursday",
        "address":"3101 The Alameda",
        "latitude":39.3257,
        "longitude":-76.6088,
        "contactPhone":"(410) 366-0096",
        "contactEmail":"Thelma Gentry",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=zsaofQv-7jZtKg_bql4jNg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=199.85551&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.9760612255,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"10:00",
            "close":"19:00"
          },
          "thursday":{
            "open":"10:00",
            "close":"19:00"
          }
        },
        "specialNotes":"Extended hours Thursday"
      },
      {
        "name":"St. Vincent's Emergency Services",
        "description":"",
        "address":"120 N. Front St.",
        "latitude":39.2912,
        "longitude":-76.6046,
        "contactPhone":"(410) 962-5078",
        "contactEmail":"Jeanne Cole",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":1.047695293,
        "offersDelivery":true,
        "openingHours":{
          "monday":{
            "open":"12:30",
            "close":"14:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"St. Wenceslaus",
        "description":"",
        "address":"2100 E. Madison St.",
        "latitude":39.3018,
        "longitude":-76.5826,
        "contactPhone":"(410) 675-3320",
        "contactEmail":"Audrey Wasson",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipNpqTcO0Pdm0SpiOtUmuNxtOxOuD4yiQ_67vqx5=w408-h272-k-no",
        "adminId":1,
        "walkingDistance":2.4327436476,
        "offersDelivery":false,
        "openingHours":{
          "wednesday":{
            "open":"11:00",
            "close":"13:00"
          },
          "thursday":{
            "open":"11:00",
            "close":"13:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Temple House",
        "description":"",
        "address":"812 N. Fulton Ave.",
        "latitude":39.2994,
        "longitude":-76.6378,
        "contactPhone":"(410) 462-1876",
        "contactEmail":"Stanley Butler",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipOgEUYt0SW_ux03yG2RLgtHjYi32kz_8tuVpSwN=w408-h306-k-no",
        "adminId":1,
        "walkingDistance":1.3794954384,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"10:00",
            "close":"12:00"
          },
          "saturday":{
            "open":"10:00",
            "close":"12:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"The Tree of Life Bible Church",
        "description":"",
        "address":"516 N. Schroeder St.",
        "latitude":39.2939,
        "longitude":-76.6447,
        "contactPhone":"(410) 542-1928",
        "contactEmail":"Lassiter Basket",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=RWLR5m6C-aSu7qXffabUHw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=322.68747&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":1.4141373257,
        "offersDelivery":false,
        "openingHours":{
          "tuesday":{
            "open":"15:00",
            "close":"19:00"
          }
        },
        "specialNotes":""
      },
      {
        "name":"Total Man Outreach",
        "description":"",
        "address":"1116 N. Gilmore St.",
        "latitude":39.3027,
        "longitude":-76.6447,
        "contactPhone":"(410) 728-8151",
        "contactEmail":"Willie Williams",
        "imageUrl":"https://lh3.googleusercontent.com/p/AF1QipO2DBNCwL5fzaPQXBEvHuwqnsdx4xjf6ltIFnnf=w618-h240-k-no",
        "adminId":1,
        "walkingDistance":1.7938554802,
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
        "name":"Trinity AME Church",
        "description":"",
        "address":"2140 E. Hoffman St.",
        "latitude":39.3125,
        "longitude":-76.5826,
        "contactPhone":"(410) 342-2320",
        "contactEmail":"Nancy Woodhouse",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":2.881508365,
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
        "name":"Trinity Apostolic Faith",
        "description":"",
        "address":"3600 W. Rogers Ave.",
        "latitude":39.3318,
        "longitude":-76.6819,
        "contactPhone":"(410) 448-1215",
        "contactEmail":"Elizabeth Milburn",
        "imageUrl":"https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CeP-eMRMV1rOswttLcO1Ew&cb_client=search.gws-prod.gps&w=408&h=240&yaw=23.409517&pitch=0&thumbfov=100",
        "adminId":1,
        "walkingDistance":4.6214058832,
        "offersDelivery":true,
        "openingHours":{
          "sunday":{
            "open":"09:30",
            "close":"12:00"
          }
        },
        "specialNotes":""
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
