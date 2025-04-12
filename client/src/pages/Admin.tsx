import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { createPantry, getPantryReservations, updateReservationStatus } from "@/lib/firebase";

export default function Admin() {
  const [, navigate] = useLocation();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedPantryId, setSelectedPantryId] = useState<string>("");
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  }, [user, isAdmin, navigate, toast]);

  useEffect(() => {
    if (selectedPantryId) {
      setIsLoadingReservations(true);
      getPantryReservations(selectedPantryId)
        .then((res) => setReservations(res))
        .catch((err) => {
          console.error("Error fetching reservations:", err);
          toast({
            title: "Error",
            description: "Failed to load reservations",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoadingReservations(false));
    }
  }, [selectedPantryId, toast]);

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    address: z.string().min(5, "Address is required"),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email("Invalid email").optional(),
    website: z.string().url("Invalid URL").optional(),
    walkingDistance: z.coerce.number().optional(),
    offersDelivery: z.boolean().default(false),
    openingHours: z.object({
      monday: z.object({
        open: z.string(),
        close: z.string(),
      }).optional(),
      tuesday: z.object({
        open: z.string(),
        close: z.string(),
      }).optional(),
      wednesday: z.object({
        open: z.string(),
        close: z.string(),
      }).optional(),
      thursday: z.object({
        open: z.string(),
        close: z.string(),
      }).optional(),
      friday: z.object({
        open: z.string(),
        close: z.string(),
      }).optional(),
      saturday: z.object({
        open: z.string(),
        close: z.string(),
      }).optional(),
      sunday: z.object({
        open: z.string(),
        close: z.string(),
      }).optional(),
    }).optional(),
    specialNotes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      latitude: 0,
      longitude: 0,
      contactPhone: "",
      contactEmail: "",
      website: "",
      walkingDistance: undefined,
      offersDelivery: false,
      specialNotes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) return;

      await createPantry({
        ...values,
        adminId: user.uid,
      });

      toast({
        title: "Success",
        description: "Food pantry has been created successfully",
      });

      form.reset();
    } catch (error) {
      console.error("Error creating pantry:", error);
      toast({
        title: "Error",
        description: "Failed to create food pantry",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReservation = async (reservationId: string, status: string) => {
    try {
      await updateReservationStatus(reservationId, status);
      
      // Update local state to reflect the change
      setReservations(
        reservations.map((res) =>
          res.id === reservationId ? { ...res, status } : res
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Reservation status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive",
      });
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-heading font-bold mb-6">Admin Dashboard</h1>

        <Tabs defaultValue="pantries">
          <TabsList className="mb-4">
            <TabsTrigger value="pantries">Manage Pantries</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pantries">
            <Card>
              <CardHeader>
                <CardTitle>Add New Food Pantry</CardTitle>
                <CardDescription>
                  Fill out the form below to add a new food resource location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Food Pantry Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude *</FormLabel>
                            <FormControl>
                              <Input type="number" step="any" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitude *</FormLabel>
                            <FormControl>
                              <Input type="number" step="any" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 555-5555" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@organization.org" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="walkingDistance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Walking Distance (miles)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1" 
                                placeholder="0.5" 
                                {...field}
                                value={field.value || ""}
                                onChange={e => {
                                  const value = e.target.value === "" ? undefined : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Approximate walking distance in miles
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="offersDelivery"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0 mt-9">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 text-primary rounded"
                              />
                            </FormControl>
                            <FormLabel className="mt-0">Offers Delivery</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe this food resource location" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="specialNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any special rules, requirements, or other important information" 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Each line will be displayed as a bullet point. For example:
                            <br />
                            • ID required for first visit
                            <br />
                            • Please bring your own bags
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full md:w-auto">
                        Create Food Pantry
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Manage Reservations</CardTitle>
                <CardDescription>
                  View and manage food reservations for your pantries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="pantry-select" className="block text-sm font-medium mb-1">
                      Select Pantry
                    </label>
                    <select
                      id="pantry-select"
                      className="w-full p-2 border rounded-md"
                      value={selectedPantryId}
                      onChange={(e) => setSelectedPantryId(e.target.value)}
                    >
                      <option value="">Select a pantry</option>
                      <option value="1">St. Mary's Food Bank</option>
                      <option value="2">Community Hope Center</option>
                      <option value="3">Neighborhood Relief Kitchen</option>
                    </select>
                  </div>
                  
                  {selectedPantryId ? (
                    isLoadingReservations ? (
                      <div className="py-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : reservations.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Notes
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reservations.map((reservation) => (
                              <tr key={reservation.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {reservation.user?.displayName || "User"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(reservation.reservationDate).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    reservation.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : reservation.status === "confirmed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {reservation.notes || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {reservation.status === "pending" && (
                                    <div className="space-x-2">
                                      <button
                                        onClick={() => handleUpdateReservation(reservation.id, "confirmed")}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => handleUpdateReservation(reservation.id, "canceled")}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="py-8 text-center text-gray-500">
                        No reservations found for this pantry
                      </p>
                    )
                  ) : (
                    <p className="py-8 text-center text-gray-500">
                      Please select a pantry to view reservations
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
