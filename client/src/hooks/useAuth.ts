import { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth, getUserProfile } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
}

export const UserContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  profile: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserContext.Provider");
  }
  return context;
};

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
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

  return { user, setUser, profile, loading, isAdmin };
};
