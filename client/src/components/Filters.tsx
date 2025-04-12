import { useState } from "react";
import { useLocation } from "wouter";
import FilterModal from "./FilterModal";
import { PantryFilter } from "@/types";

interface FiltersProps {
  filters: PantryFilter;
  setFilters: (filters: PantryFilter) => void;
  totalResults: number;
}

export default function Filters({ filters, setFilters, totalResults }: FiltersProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [, navigate] = useLocation();

  const toggleFilter = (key: keyof PantryFilter, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  return (
    <>
      <div className="bg-white shadow-sm mb-3">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-heading font-medium">
              Find Free Food
            </h2>
            <button
              className="text-primary flex items-center"
              onClick={toggleFilterModal}
            >
              <span>Filters</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>
          <div className="filters-container overflow-x-auto flex space-x-2 py-1">
            <button
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                filters.isOpen
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-neutral-dark"
              }`}
              onClick={() => toggleFilter("isOpen", !filters.isOpen)}
            >
              Open Now
            </button>
            <button
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                filters.walkingDistance
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-neutral-dark"
              }`}
              onClick={() => toggleFilter("walkingDistance", !filters.walkingDistance)}
            >
              Walking Distance
            </button>
            <button
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                filters.dietary?.vegetarian
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-neutral-dark"
              }`}
              onClick={() => toggleFilter("dietary", {
                ...filters.dietary,
                vegetarian: !filters.dietary?.vegetarian
              })}
            >
              Vegetarian
            </button>
            <button
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                filters.preparationRequired?.includes("None")
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-neutral-dark"
              }`}
              onClick={() => {
                const current = filters.preparationRequired || [];
                const updatedPrep = current.includes("None")
                  ? current.filter(p => p !== "None")
                  : [...current, "None"];
                toggleFilter("preparationRequired", updatedPrep);
              }}
            >
              Ready to Eat
            </button>
            <button
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                filters.offersDelivery
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-neutral-dark"
              }`}
              onClick={() => toggleFilter("offersDelivery", !filters.offersDelivery)}
            >
              Delivery
            </button>
            <button
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                filters.minRating === 4
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-neutral-dark"
              }`}
              onClick={() => toggleFilter("minRating", filters.minRating === 4 ? undefined : 4)}
            >
              Highest Rated
            </button>
          </div>
        </div>
      </div>

      {showFilterModal && (
        <FilterModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </>
  );
}
