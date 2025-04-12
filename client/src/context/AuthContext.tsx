import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { auth, getUserProfile } from "@/lib/firebase";

interface UserProfile {
  displayName?: string;
  email?: string;
  profileImage?: string;
  isAdmin?: boolean;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          setProfile(userProfile);
          setIsAdmin(userProfile?.isAdmin || false);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
          setIsAdmin(false);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No authenticated user");
    
    try {
      // Update in Firestore
      // In a real app, you would update the user profile in your database
      console.log("Updating profile with:", data);
      
      // Update local state
      setProfile(prev => {
        if (!prev) return data;
        return { ...prev, ...data };
      });
      
      // Check if isAdmin is being updated
      if (data.isAdmin !== undefined) {
        setIsAdmin(data.isAdmin);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
