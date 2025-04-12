import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserReservations, createReservation, updateReservationStatus } from "@/lib/firebase";
import { useAuth } from "./useAuth";
import { Reservation } from "@/types";
import { useToast } from "./use-toast";

export const useReservations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: reservations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reservations", user?.uid],
    queryFn: () => (user ? getUserReservations(user.uid) : Promise.resolve([])),
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });

  const createReservationMutation = useMutation({
    mutationFn: async ({
      pantryId,
      notes,
    }: {
      pantryId: string;
      notes?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");
      return createReservation(user.uid, pantryId, {
        reservationDate: new Date(),
        notes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Reservation Created",
        description: "Your food reservation has been submitted",
      });
      queryClient.invalidateQueries({ queryKey: ["reservations", user?.uid] });
    },
    onError: (error) => {
      console.error("Error creating reservation:", error);
      toast({
        title: "Reservation Failed",
        description: "Could not create your reservation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cancelReservationMutation = useMutation({
    mutationFn: async (reservationId: string) => {
      return updateReservationStatus(reservationId, "canceled");
    },
    onSuccess: () => {
      toast({
        title: "Reservation Canceled",
        description: "Your reservation has been canceled",
      });
      queryClient.invalidateQueries({ queryKey: ["reservations", user?.uid] });
    },
    onError: (error) => {
      console.error("Error canceling reservation:", error);
      toast({
        title: "Action Failed",
        description: "Could not cancel your reservation. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    reservations,
    isLoading,
    error,
    refetch,
    createReservation: createReservationMutation.mutate,
    cancelReservation: cancelReservationMutation.mutate,
    isCreatingReservation: createReservationMutation.isPending,
    isCancelingReservation: cancelReservationMutation.isPending,
  };
};
