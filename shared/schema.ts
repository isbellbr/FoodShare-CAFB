import { pgTable, text, serial, integer, boolean, timestamp, json, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  displayName: text("display_name"),
  profileImage: text("profile_image"),
  isAdmin: boolean("is_admin").default(false),
  location: json("location").$type<{
    latitude?: number;
    longitude?: number;
    address?: string;
  }>(),
});

// Food pantry table
export const pantries = pgTable("pantries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  website: text("website"),
  imageUrl: text("image_url"),
  adminId: integer("admin_id").references(() => users.id),
  walkingDistance: real("walking_distance"), // in miles
  offersDelivery: boolean("offers_delivery").default(false),
  openingHours: json("opening_hours").$type<{
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  }>(),
  specialNotes: text("special_notes"),
});

// Available food items at a pantry
export const foodItems = pgTable("food_items", {
  id: serial("id").primaryKey(),
  pantryId: integer("pantry_id").references(() => pantries.id).notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., produce, dairy, meat, canned
  inStock: boolean("in_stock").default(true),
  quantity: text("quantity"), // e.g., high, medium, low
  freshness: text("freshness"), // e.g., fresh, 1-day old
  deliveryDate: timestamp("delivery_date"),
  dietaryType: json("dietary_type").$type<{
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  }>(),
  preparationRequired: text("preparation_required"), // e.g., none, minimal, cooking
});

// User reviews for pantries
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  pantryId: integer("pantry_id").references(() => pantries.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User's saved/favorite pantries
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  pantryId: integer("pantry_id").references(() => pantries.id).notNull(),
});

// Pantry reservation
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  pantryId: integer("pantry_id").references(() => pantries.id).notNull(),
  reservationDate: timestamp("reservation_date").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // pending, confirmed, canceled
  notes: text("notes"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  profileImage: true,
  isAdmin: true,
  location: true,
});

export const insertPantrySchema = createInsertSchema(pantries);
export const insertFoodItemSchema = createInsertSchema(foodItems);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertFavoriteSchema = createInsertSchema(favorites);
export const insertReservationSchema = createInsertSchema(reservations);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Pantry = typeof pantries.$inferSelect;
export type InsertPantry = z.infer<typeof insertPantrySchema>;

export type FoodItem = typeof foodItems.$inferSelect;
export type InsertFoodItem = z.infer<typeof insertFoodItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

// Extended schemas for frontend validation
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const reviewFormSchema = insertReviewSchema.pick({
  rating: true,
  comment: true,
});

export const pantryFilterSchema = z.object({
  isOpen: z.boolean().optional(),
  maxDistance: z.number().optional(),
  walkingDistance: z.boolean().optional(),
  offersDelivery: z.boolean().optional(),
  minRating: z.number().optional(),
  categories: z.array(z.string()).optional(),
  dietary: z.object({
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    dairyFree: z.boolean().optional(),
  }).optional(),
  preparationRequired: z.array(z.string()).optional(),
  freshness: z.string().optional(),
});

export type PantryFilter = z.infer<typeof pantryFilterSchema>;
