import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, GeoPoint } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGWRZyimxCPNSE7Uzwt5xzJrgZGcYnmfw",
  authDomain: "freefood-e1766.firebaseapp.com",
  projectId: "freefood-e1766",
  storageBucket: "freefood-e1766.appspot.com",
  messagingSenderId: "450198343409",
  appId: "1:450198343409:web:7872991dd70a0001a0a350"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth functions
export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// User profile
export const createUserProfile = async (userId: string, profileData: any) => {
  await setDoc(doc(db, "users", userId), {
    ...profileData,
    createdAt: new Date(),
  });
};

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

// Pantry functions
export const createPantry = async (pantryData: any) => {
  return addDoc(collection(db, "pantries"), {
    ...pantryData,
    location: new GeoPoint(pantryData.latitude, pantryData.longitude),
    createdAt: new Date(),
  });
};

export const getPantry = async (pantryId: string) => {
  const docRef = doc(db, "pantries", pantryId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updatePantry = async (pantryId: string, data: any) => {
  const pantryRef = doc(db, "pantries", pantryId);
  await updateDoc(pantryRef, data);
};

export const deletePantry = async (pantryId: string) => {
  await deleteDoc(doc(db, "pantries", pantryId));
};

export const getAllPantries = async () => {
  const querySnapshot = await getDocs(collection(db, "pantries"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Food items functions
export const addFoodItem = async (pantryId: string, itemData: any) => {
  const foodItemsRef = collection(db, "pantries", pantryId, "foodItems");
  return addDoc(foodItemsRef, {
    ...itemData,
    createdAt: new Date(),
  });
};

export const getPantryFoodItems = async (pantryId: string) => {
  const foodItemsRef = collection(db, "pantries", pantryId, "foodItems");
  const querySnapshot = await getDocs(foodItemsRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Reviews functions
export const addReview = async (pantryId: string, userId: string, reviewData: any) => {
  const reviewsRef = collection(db, "pantries", pantryId, "reviews");
  return addDoc(reviewsRef, {
    ...reviewData,
    userId,
    createdAt: new Date(),
  });
};

export const getPantryReviews = async (pantryId: string) => {
  const reviewsRef = collection(db, "pantries", pantryId, "reviews");
  const querySnapshot = await getDocs(reviewsRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Favorites functions
export const addFavorite = async (userId: string, pantryId: string) => {
  const favoritesRef = collection(db, "users", userId, "favorites");
  return addDoc(favoritesRef, {
    pantryId,
    createdAt: new Date(),
  });
};

export const removeFavorite = async (userId: string, favoriteId: string) => {
  await deleteDoc(doc(db, "users", userId, "favorites", favoriteId));
};

export const getUserFavorites = async (userId: string) => {
  const favoritesRef = collection(db, "users", userId, "favorites");
  const querySnapshot = await getDocs(favoritesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Reservations functions
export const createReservation = async (userId: string, pantryId: string, reservationData: any) => {
  const reservationsRef = collection(db, "reservations");
  return addDoc(reservationsRef, {
    ...reservationData,
    userId,
    pantryId,
    status: "pending",
    createdAt: new Date(),
  });
};

export const getUserReservations = async (userId: string) => {
  const reservationsRef = collection(db, "reservations");
  const q = query(reservationsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPantryReservations = async (pantryId: string) => {
  const reservationsRef = collection(db, "reservations");
  const q = query(reservationsRef, where("pantryId", "==", pantryId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateReservationStatus = async (reservationId: string, status: string) => {
  const reservationRef = doc(db, "reservations", reservationId);
  await updateDoc(reservationRef, { status });
};

// File upload
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
