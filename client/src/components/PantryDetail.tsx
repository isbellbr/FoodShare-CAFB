import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Pantry, FoodItem, Review } from "@/types";
import { getPantryStatus, formatOpeningHours, formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ReviewItem from "./ReviewItem";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addReview, createReservation } from "@/lib/firebase";

interface PantryDetailProps {
  pantry: Pantry;
  foodItems: FoodItem[];
  reviews: Review[];
  visible: boolean;
  onClose: () => void;
}

export default function PantryDetail({
  pantry,
  foodItems,
  reviews,
  visible,
  onClose,
}: PantryDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [reservationNotes, setReservationNotes] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const roundedRating = Math.round(avgRating * 10) / 10;

  const { status, statusText } = getPantryStatus(pantry.openingHours);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save this pantry",
        variant: "destructive",
      });
      return;
    }
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${pantry.name} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
    });
  };

  const handleReservation = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a reservation",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReservation(user.uid, pantry.id, {
        reservationDate: new Date(),
        notes: reservationNotes,
      });

      toast({
        title: "Reservation Confirmed",
        description: `Your reservation at ${pantry.name} has been submitted.`,
      });

      setShowReservationDialog(false);
      setReservationNotes("");
    } catch (error) {
      toast({
        title: "Reservation Failed",
        description: "There was an error making your reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${pantry.latitude},${pantry.longitude}`,
      "_blank"
    );
  };

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  // Group food items by category
  const foodItemsByCategory: Record<string, FoodItem[]> = {};
  foodItems.forEach(item => {
    if (!foodItemsByCategory[item.category]) {
      foodItemsByCategory[item.category] = [];
    }
    foodItemsByCategory[item.category].push(item);
  });

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-dark bg-opacity-70 flex items-center justify-center overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64">
          <img
            src={pantry.imageUrl || "https://images.unsplash.com/photo-1593113598332-cd59a93e6f91"}
            className="w-full h-full object-cover"
            alt={pantry.name}
          />
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              className="bg-white rounded-full p-2 shadow-md"
              onClick={handleToggleFavorite}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${isFavorite ? "text-red-500 fill-current" : "text-neutral-dark"}`}
                fill={isFavorite ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button
              className="bg-white rounded-full p-2 shadow-md"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: pantry.name,
                    text: `Check out ${pantry.name} for free food resources!`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: "Link Copied",
                    description: "Link copied to clipboard",
                  });
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-neutral-dark to-transparent opacity-60"></div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-heading font-bold">{pantry.name}</h2>
              <div className="flex items-center text-sm mt-1">
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${star > Math.round(roundedRating) ? "opacity-30" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-neutral-dark">{roundedRating.toFixed(1)}</span>
                </div>
                <span className="mx-2 text-neutral-gray">•</span>
                <span className="text-neutral-gray">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
            <span className={`status-badge status-${status}`}>{statusText}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-3">Info & Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-neutral-gray flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p>{pantry.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-neutral-gray flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Hours:</p>
                    {pantry.openingHours && (
                      <>
                        {pantry.openingHours.monday && (
                          <p>Monday: {pantry.openingHours.monday.open} - {pantry.openingHours.monday.close}</p>
                        )}
                        {pantry.openingHours.tuesday && (
                          <p>Tuesday: {pantry.openingHours.tuesday.open} - {pantry.openingHours.tuesday.close}</p>
                        )}
                        {pantry.openingHours.wednesday && (
                          <p>Wednesday: {pantry.openingHours.wednesday.open} - {pantry.openingHours.wednesday.close}</p>
                        )}
                        {pantry.openingHours.thursday && (
                          <p>Thursday: {pantry.openingHours.thursday.open} - {pantry.openingHours.thursday.close}</p>
                        )}
                        {pantry.openingHours.friday && (
                          <p>Friday: {pantry.openingHours.friday.open} - {pantry.openingHours.friday.close}</p>
                        )}
                        {pantry.openingHours.saturday && (
                          <p>Saturday: {pantry.openingHours.saturday.open} - {pantry.openingHours.saturday.close}</p>
                        )}
                        {pantry.openingHours.sunday && (
                          <p>Sunday: {pantry.openingHours.sunday.open} - {pantry.openingHours.sunday.close}</p>
                        )}
                        {!pantry.openingHours.sunday && <p>Sunday: Closed</p>}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-neutral-gray flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Contact:</p>
                    {pantry.contactPhone && <p>{pantry.contactPhone}</p>}
                    {pantry.contactEmail && <p>{pantry.contactEmail}</p>}
                    {!pantry.contactPhone && !pantry.contactEmail && (
                      <p>No contact information available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-3">Available Food</h3>
              <div className="space-y-3">
                {Object.entries(foodItemsByCategory).map(([category, items]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span>{category}</span>
                    <div className="flex">
                      {items.some(item => item.freshness === "Fresh") && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded mr-2">
                          Fresh
                        </span>
                      )}
                      {items.some(item => item.quantity === "High Quantity") && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          High Quantity
                        </span>
                      )}
                      {items.some(item => item.quantity === "Limited") && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Limited
                        </span>
                      )}
                      {items.some(item => !item.inStock) && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {Object.keys(foodItemsByCategory).length === 0 && (
                  <p className="text-neutral-gray text-sm">
                    No food item information available
                  </p>
                )}
              </div>
              {Object.keys(foodItemsByCategory).length > 0 && (
                <div className="mt-4">
                  <button className="text-primary text-sm font-medium">
                    See full inventory →
                  </button>
                </div>
              )}
            </div>
          </div>

          {pantry.specialNotes && (
            <div className="mb-6">
              <h3 className="font-heading font-semibold text-lg mb-3">Special Notes</h3>
              <div className="bg-neutral-light rounded-lg p-4 text-sm whitespace-pre-line">
                {pantry.specialNotes}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-heading font-semibold text-lg mb-3">Reviews</h3>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}

                {!showAllReviews && reviews.length > 2 && (
                  <button
                    className="text-primary font-medium text-sm"
                    onClick={handleShowAllReviews}
                  >
                    Read all {reviews.length} reviews →
                  </button>
                )}
              </div>
            ) : (
              <p className="text-neutral-gray text-sm">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              className="flex-1 bg-primary text-white py-3 rounded-lg font-medium shadow-sm"
              onClick={() => setShowReservationDialog(true)}
            >
              Reserve Food
            </button>
            <button
              className="flex-1 bg-neutral-light text-neutral-dark py-3 rounded-lg font-medium shadow-sm"
              onClick={handleGetDirections}
            >
              Get Directions
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve Food at {pantry.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-neutral-gray mb-2">
                Reserving food helps the pantry prepare for your visit. Please add any special notes or requests:
              </p>
              <Textarea
                placeholder="Any special requests or dietary restrictions?"
                className="min-h-[100px]"
                value={reservationNotes}
                onChange={(e) => setReservationNotes(e.target.value)}
              />
            </div>
            <div className="bg-yellow-50 p-3 rounded-md text-sm">
              <p className="font-medium text-yellow-800">Important:</p>
              <p className="text-yellow-700">
                Reservation is subject to availability. Please bring ID if required by this location.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReservationDialog(false)}>Cancel</Button>
            <Button onClick={handleReservation}>Confirm Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
