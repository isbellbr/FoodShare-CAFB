import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPantrySchema, insertFoodItemSchema, insertReviewSchema, insertReservationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Authentication routes
  apiRouter.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, we would set up proper authentication with JWT
      // For this demo, we'll use a session-based approach
      if (!req.session) {
        return res.status(500).json({ message: "Session not initialized" });
      }
      
      // Store user info in session
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({ user: userWithoutPassword });
      
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.post("/auth/register", async (req: Request, res: Response) => {
    try {
      const userInput = req.body;
      
      try {
        const validatedData = insertUserSchema.parse(userInput);
        
        // Check if username already exists
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }
        
        const newUser = await storage.createUser(validatedData);
        
        // Don't return the password
        const { password, ...userWithoutPassword } = newUser;
        
        // Log the user in (set session)
        if (req.session) {
          req.session.userId = newUser.id;
          req.session.isAdmin = newUser.isAdmin;
        }
        
        return res.status(201).json(userWithoutPassword);
        
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ message: validationError.errors });
        }
        throw validationError;
      }
      
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.post("/auth/logout", (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      return res.status(200).json({ message: "Already logged out" });
    }
  });
  
  apiRouter.get("/auth/me", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        // Session exists but user doesn't - clear the session
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
      
    } catch (error) {
      console.error("Auth check error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // User routes
  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
      
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.put("/users/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Users can only update their own profiles unless they're admins
      if (userId !== req.session.userId && !req.session.isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this user" });
      }
      
      const userData = req.body;
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json(userWithoutPassword);
      
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Food Pantry routes
  apiRouter.get("/pantries", async (req: Request, res: Response) => {
    try {
      let pantries;
      
      // Check if requesting nearby pantries
      if (req.query.lat && req.query.lng && req.query.radius) {
        const lat = parseFloat(req.query.lat as string);
        const lng = parseFloat(req.query.lng as string);
        const radius = parseFloat(req.query.radius as string);
        
        if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
          return res.status(400).json({ message: "Invalid location parameters" });
        }
        
        pantries = await storage.getNearbyPantries(lat, lng, radius);
      } else {
        // Get all pantries
        pantries = await storage.getAllPantries();
      }
      
      return res.status(200).json(pantries);
      
    } catch (error) {
      console.error("Get pantries error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.get("/pantries/:id", async (req: Request, res: Response) => {
    try {
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const pantry = await storage.getPantry(pantryId);
      
      if (!pantry) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      return res.status(200).json(pantry);
      
    } catch (error) {
      console.error("Get pantry error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.post("/pantries", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Only admins can create pantries
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Not authorized to create pantries" });
      }
      
      const pantryData = req.body;
      
      try {
        const validatedData = insertPantrySchema.parse(pantryData);
        const newPantry = await storage.createPantry(validatedData);
        return res.status(201).json(newPantry);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ message: validationError.errors });
        }
        throw validationError;
      }
      
    } catch (error) {
      console.error("Create pantry error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.put("/pantries/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Only admins can update pantries
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Not authorized to update pantries" });
      }
      
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const pantryData = req.body;
      const updatedPantry = await storage.updatePantry(pantryId, pantryData);
      
      if (!updatedPantry) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      return res.status(200).json(updatedPantry);
      
    } catch (error) {
      console.error("Update pantry error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.delete("/pantries/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Only admins can delete pantries
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Not authorized to delete pantries" });
      }
      
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const deleted = await storage.deletePantry(pantryId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      return res.status(200).json({ message: "Pantry deleted successfully" });
      
    } catch (error) {
      console.error("Delete pantry error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Food Item routes
  apiRouter.get("/pantries/:id/food-items", async (req: Request, res: Response) => {
    try {
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const pantry = await storage.getPantry(pantryId);
      
      if (!pantry) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      const items = await storage.getFoodItems(pantryId);
      return res.status(200).json(items);
      
    } catch (error) {
      console.error("Get food items error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.post("/pantries/:id/food-items", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Only admins can add food items
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Not authorized to add food items" });
      }
      
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const pantry = await storage.getPantry(pantryId);
      
      if (!pantry) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      const itemData = { ...req.body, pantryId };
      
      try {
        const validatedData = insertFoodItemSchema.parse(itemData);
        const newItem = await storage.createFoodItem(validatedData);
        return res.status(201).json(newItem);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ message: validationError.errors });
        }
        throw validationError;
      }
      
    } catch (error) {
      console.error("Create food item error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Review routes
  apiRouter.get("/pantries/:id/reviews", async (req: Request, res: Response) => {
    try {
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const pantry = await storage.getPantry(pantryId);
      
      if (!pantry) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      const reviews = await storage.getPantryReviews(pantryId);
      return res.status(200).json(reviews);
      
    } catch (error) {
      console.error("Get reviews error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.post("/pantries/:id/reviews", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const pantry = await storage.getPantry(pantryId);
      
      if (!pantry) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      const reviewData = {
        ...req.body,
        userId: req.session.userId,
        pantryId,
        createdAt: new Date()
      };
      
      try {
        const validatedData = insertReviewSchema.parse(reviewData);
        const newReview = await storage.createReview(validatedData);
        return res.status(201).json(newReview);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ message: validationError.errors });
        }
        throw validationError;
      }
      
    } catch (error) {
      console.error("Create review error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Favorites routes
  apiRouter.get("/users/favorites", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const favorites = await storage.getUserFavorites(req.session.userId);
      return res.status(200).json(favorites);
      
    } catch (error) {
      console.error("Get favorites error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.post("/pantries/:id/favorite", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const pantry = await storage.getPantry(pantryId);
      
      if (!pantry) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      const favorite = await storage.addFavorite({
        userId: req.session.userId,
        pantryId
      });
      
      return res.status(201).json(favorite);
      
    } catch (error) {
      console.error("Add favorite error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.delete("/pantries/:id/favorite", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const removed = await storage.removeFavorite(req.session.userId, pantryId);
      
      if (!removed) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      return res.status(200).json({ message: "Removed from favorites" });
      
    } catch (error) {
      console.error("Remove favorite error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Reservation routes
  apiRouter.get("/reservations", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const reservations = await storage.getUserReservations(req.session.userId);
      return res.status(200).json(reservations);
      
    } catch (error) {
      console.error("Get reservations error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.post("/pantries/:id/reserve", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const pantryId = parseInt(req.params.id);
      
      if (isNaN(pantryId)) {
        return res.status(400).json({ message: "Invalid pantry ID" });
      }
      
      const pantry = await storage.getPantry(pantryId);
      
      if (!pantry) {
        return res.status(404).json({ message: "Pantry not found" });
      }
      
      const reservationData = {
        ...req.body,
        userId: req.session.userId,
        pantryId,
        reservationDate: new Date(req.body.reservationDate || Date.now()),
        status: "pending"
      };
      
      try {
        const validatedData = insertReservationSchema.parse(reservationData);
        const newReservation = await storage.createReservation(validatedData);
        return res.status(201).json(newReservation);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ message: validationError.errors });
        }
        throw validationError;
      }
      
    } catch (error) {
      console.error("Create reservation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.put("/reservations/:id/status", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Only admins can update reservation status
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Not authorized to update reservation status" });
      }
      
      const reservationId = parseInt(req.params.id);
      
      if (isNaN(reservationId)) {
        return res.status(400).json({ message: "Invalid reservation ID" });
      }
      
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "canceled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedReservation = await storage.updateReservationStatus(reservationId, status);
      
      if (!updatedReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      return res.status(200).json(updatedReservation);
      
    } catch (error) {
      console.error("Update reservation status error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Register the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
