import { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Home from "@/pages/Home";
import PantryDetails from "@/pages/PantryDetails";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import Saved from "@/pages/Saved";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import { UserContext } from "./hooks/useAuth";
import DebugEnv from "@/components/DebugEnv";

function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // For debugging purposes, we're just setting a basic profile
          // In a production app, you would fetch this from Firebase
          setProfile({
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            // Assuming admin for now for testing
            isAdmin: true
          });
          setIsAdmin(true);
        } catch (error) {
          console.error("Error setting user profile:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser, profile, loading, isAdmin }}>
        <div className="flex flex-col min-h-screen">
          <div className="fixed top-0 left-0 z-50 w-full">
            <DebugEnv />
          </div>
          <div className="flex-grow pt-12">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/pantry/:id" component={PantryDetails} />
              <Route path="/search" component={Search} />
              <Route path="/profile" component={Profile} />
              <Route path="/saved" component={Saved} />
              <Route path="/auth" component={Auth} />
              <Route path="/admin" component={Admin} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
        <Toaster />
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
