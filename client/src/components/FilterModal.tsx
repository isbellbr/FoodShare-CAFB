import { useState, useEffect } from "react";
import { PantryFilter } from "@/types";

interface FilterModalProps {
  filters: PantryFilter;
  setFilters: (filters: PantryFilter) => void;
  onClose: () => void;
}

export default function FilterModal({ filters, setFilters, onClose }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<PantryFilter>(filters);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleResetFilters = () => {
    setLocalFilters({});
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const updateDistance = (value: string) => {
    if (value === "any") {
      setLocalFilters({ ...localFilters, maxDistance: undefined, walkingDistance: false });
    } else if (value === "walking") {
      setLocalFilters({ ...localFilters, maxDistance: 1, walkingDistance: true });
    } else if (value === "biking") {
      setLocalFilters({ ...localFilters, maxDistance: 3, walkingDistance: false });
    } else if (value === "driving") {
      setLocalFilters({ ...localFilters, maxDistance: 10, walkingDistance: false });
    }
  };

  const updateAvailability = (key: string, value: boolean) => {
    if (key === "isOpen") {
      setLocalFilters({ ...localFilters, isOpen: value });
    } else if (key === "offersDelivery") {
      setLocalFilters({ ...localFilters, offersDelivery: value });
    }
  };

  const updateFoodOption = (category: string, value: boolean) => {
    const currentCategories = localFilters.categories || [];
    if (value) {
      if (!currentCategories.includes(category)) {
        setLocalFilters({
          ...localFilters,
          categories: [...currentCategories, category],
        });
      }
    } else {
      setLocalFilters({
        ...localFilters,
        categories: currentCategories.filter((c) => c !== category),
      });
    }
  };

  const updateDietary = (key: string, value: boolean) => {
    setLocalFilters({
      ...localFilters,
      dietary: {
        ...(localFilters.dietary || {}),
        [key]: value,
      },
    });
  };

  const updatePreparation = (prep: string, value: boolean) => {
    const currentPrep = localFilters.preparationRequired || [];
    if (value) {
      if (!currentPrep.includes(prep)) {
        setLocalFilters({
          ...localFilters,
          preparationRequired: [...currentPrep, prep],
        });
      }
    } else {
      setLocalFilters({
        ...localFilters,
        preparationRequired: currentPrep.filter((p) => p !== prep),
      });
    }
  };

  const updateFreshness = (value: string) => {
    setLocalFilters({ ...localFilters, freshness: value });
  };

  const updateRating = (value: number | undefined) => {
    setLocalFilters({ ...localFilters, minRating: value });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-dark bg-opacity-70 flex items-end md:items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-t-xl md:rounded-xl w-full max-w-md md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-heading font-semibold">Filters</h2>
            <button onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
          </div>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-heading font-medium mb-3">Distance</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="distance"
                className="h-4 w-4 text-primary"
                checked={!localFilters.maxDistance && !localFilters.walkingDistance}
                onChange={() => updateDistance("any")}
              />
              <span className="ml-2">Any distance</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="distance"
                className="h-4 w-4 text-primary"
                checked={!!localFilters.walkingDistance}
                onChange={() => updateDistance("walking")}
              />
              <span className="ml-2">Walking distance (&lt; 1 mile)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="distance"
                className="h-4 w-4 text-primary"
                checked={localFilters.maxDistance === 3 && !localFilters.walkingDistance}
                onChange={() => updateDistance("biking")}
              />
              <span className="ml-2">Biking distance (&lt; 3 miles)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="distance"
                className="h-4 w-4 text-primary"
                checked={localFilters.maxDistance === 10 && !localFilters.walkingDistance}
                onChange={() => updateDistance("driving")}
              />
              <span className="ml-2">Driving distance (&lt; 10 miles)</span>
            </label>
          </div>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-heading font-medium mb-3">Availability</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={!!localFilters.isOpen}
                onChange={(e) => updateAvailability("isOpen", e.target.checked)}
              />
              <span className="ml-2">Open now</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={false}
                onChange={() => {}}
              />
              <span className="ml-2">Open tomorrow</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={false}
                onChange={() => {}}
              />
              <span className="ml-2">Open on weekends</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={!!localFilters.offersDelivery}
                onChange={(e) => updateAvailability("offersDelivery", e.target.checked)}
              />
              <span className="ml-2">Offers delivery</span>
            </label>
          </div>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-heading font-medium mb-3">Food Options</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.categories || []).includes("Produce")}
                onChange={(e) => updateFoodOption("Produce", e.target.checked)}
              />
              <span className="ml-2">Produce</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.categories || []).includes("Dairy")}
                onChange={(e) => updateFoodOption("Dairy", e.target.checked)}
              />
              <span className="ml-2">Dairy</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.categories || []).includes("Meat")}
                onChange={(e) => updateFoodOption("Meat", e.target.checked)}
              />
              <span className="ml-2">Meat</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.categories || []).includes("Canned Goods")}
                onChange={(e) => updateFoodOption("Canned Goods", e.target.checked)}
              />
              <span className="ml-2">Canned Goods</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.categories || []).includes("Bread")}
                onChange={(e) => updateFoodOption("Bread", e.target.checked)}
              />
              <span className="ml-2">Bread</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.categories || []).includes("Hot Meals")}
                onChange={(e) => updateFoodOption("Hot Meals", e.target.checked)}
              />
              <span className="ml-2">Hot Meals</span>
            </label>
          </div>
          <div className="mt-3">
            <h4 className="font-medium mb-2">Dietary Restrictions</h4>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary rounded"
                  checked={!!localFilters.dietary?.vegetarian}
                  onChange={(e) => updateDietary("vegetarian", e.target.checked)}
                />
                <span className="ml-2">Vegetarian</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary rounded"
                  checked={!!localFilters.dietary?.vegan}
                  onChange={(e) => updateDietary("vegan", e.target.checked)}
                />
                <span className="ml-2">Vegan</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary rounded"
                  checked={!!localFilters.dietary?.glutenFree}
                  onChange={(e) => updateDietary("glutenFree", e.target.checked)}
                />
                <span className="ml-2">Gluten-Free</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary rounded"
                  checked={!!localFilters.dietary?.dairyFree}
                  onChange={(e) => updateDietary("dairyFree", e.target.checked)}
                />
                <span className="ml-2">Dairy-Free</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-heading font-medium mb-3">Preparation</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.preparationRequired || []).includes("None")}
                onChange={(e) => updatePreparation("None", e.target.checked)}
              />
              <span className="ml-2">Ready to eat</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.preparationRequired || []).includes("Minimal")}
                onChange={(e) => updatePreparation("Minimal", e.target.checked)}
              />
              <span className="ml-2">Minimal preparation</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                checked={(localFilters.preparationRequired || []).includes("Cooking")}
                onChange={(e) => updatePreparation("Cooking", e.target.checked)}
              />
              <span className="ml-2">Cooking required</span>
            </label>
          </div>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-heading font-medium mb-3">Freshness</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="freshness"
                className="h-4 w-4 text-primary"
                checked={!localFilters.freshness}
                onChange={() => updateFreshness("")}
              />
              <span className="ml-2">Any</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="freshness"
                className="h-4 w-4 text-primary"
                checked={localFilters.freshness === "Fresh"}
                onChange={() => updateFreshness("Fresh")}
              />
              <span className="ml-2">Fresh (Today)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="freshness"
                className="h-4 w-4 text-primary"
                checked={localFilters.freshness === "Recent"}
                onChange={() => updateFreshness("Recent")}
              />
              <span className="ml-2">Within last 3 days</span>
            </label>
          </div>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-heading font-medium mb-3">Rating</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="rating"
                className="h-4 w-4 text-primary"
                checked={!localFilters.minRating}
                onChange={() => updateRating(undefined)}
              />
              <span className="ml-2">Any</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="rating"
                className="h-4 w-4 text-primary"
                checked={localFilters.minRating === 4}
                onChange={() => updateRating(4)}
              />
              <span className="ml-2">4+ stars</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="rating"
                className="h-4 w-4 text-primary"
                checked={localFilters.minRating === 3}
                onChange={() => updateRating(3)}
              />
              <span className="ml-2">3+ stars</span>
            </label>
          </div>
        </div>

        <div className="p-4">
          <div className="flex space-x-3">
            <button
              className="flex-1 bg-neutral-light text-neutral-dark py-3 rounded-lg font-medium"
              onClick={handleResetFilters}
            >
              Reset
            </button>
            <button
              className="flex-1 bg-primary text-white py-3 rounded-lg font-medium"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
