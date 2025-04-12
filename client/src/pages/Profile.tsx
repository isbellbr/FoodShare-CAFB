import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useReservations } from "@/hooks/useReservations";
import { logout } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useLocation as useUserLocation } from "@/hooks/useLocation";
import { formatDate } from "@/lib/utils";

export default function Profile() {
  const [, navigate] = useLocation();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { reservations, isLoading: isLoadingReservations, cancelReservation } = useReservations();
  const { location, getCurrentLocation } = useUserLocation();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    cancelReservation(reservationId);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-medium mr-4">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">
              {user.displayName || "User"}
            </h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <Tabs defaultValue="reservations">
          <TabsList className="mb-4">
            <TabsTrigger value="reservations">My Reservations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Food Reservations</CardTitle>
                <CardDescription>
                  Your upcoming and past food reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingReservations ? (
                  <div className="py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : reservations.length > 0 ? (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{reservation.pantry?.name || "Food Pantry"}</h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(reservation.reservationDate)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reservation.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : reservation.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </span>
                        </div>
                        {reservation.notes && (
                          <p className="text-sm mt-2 bg-gray-50 p-2 rounded">
                            {reservation.notes}
                          </p>
                        )}
                        {reservation.status === "pending" && (
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelReservation(reservation.id)}
                            >
                              Cancel Reservation
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500 mb-4">
                      You don't have any food reservations yet
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Find Food Resources
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-sm">
                      {location ? location.address : "No location set"}
                    </span>
                    <Button size="sm" variant="outline" onClick={getCurrentLocation}>
                      Update
                    </Button>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/admin")}
                      className="w-full"
                    >
                      Admin Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-6 flex flex-col items-stretch">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
