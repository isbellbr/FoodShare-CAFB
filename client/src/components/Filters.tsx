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
            <div className="flex items-center">
              <h2 className="text-lg font-heading font-medium">
                Find Free Food
              </h2>
              <span className="ml-2 text-sm text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                {totalResults} found
              </span>
            </div>
            <button
              className="text-primary flex items-center px-3 py-1 border border-primary rounded-full hover:bg-primary/10 transition-colors"
              onClick={toggleFilterModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
              <span>All Filters</span>
            </button>
          </div>
          
          <div className="filters-wrapper mb-2">
            <h3 className="text-xs text-gray-500 mb-1">Quick Filters:</h3>
            <div className="filters-container overflow-x-auto flex flex-wrap gap-2 py-1">
              <button
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 border transition-colors ${
                  filters.isOpen
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => toggleFilter("isOpen", !filters.isOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Open Now</span>
                {filters.isOpen && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <button
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 border transition-colors ${
                  filters.walkingDistance
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => toggleFilter("walkingDistance", !filters.walkingDistance)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span>Walking Distance</span>
                {filters.walkingDistance && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <button
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 border transition-colors ${
                  filters.offersDelivery
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => toggleFilter("offersDelivery", !filters.offersDelivery)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <span>Delivery Available</span>
                {filters.offersDelivery && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <button
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 border transition-colors ${
                  filters.preparationRequired?.includes("None")
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => {
                  const current = filters.preparationRequired || [];
                  const updatedPrep = current.includes("None")
                    ? current.filter(p => p !== "None")
                    : [...current, "None"];
                  toggleFilter("preparationRequired", updatedPrep);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>Ready to Eat</span>
                {filters.preparationRequired?.includes("None") && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {Object.keys(filters).length > 0 && (
            <div className="active-filters flex items-center text-xs text-gray-500">
              <span className="mr-2">Active filters:</span>
              <div className="overflow-x-auto flex space-x-1">
                {filters.isOpen && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">Open Now</span>}
                {filters.walkingDistance && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">Walking Distance</span>}
                {filters.offersDelivery && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">Delivery</span>}
                {filters.preparationRequired?.includes("None") && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">Ready to Eat</span>}
                {filters.dietary?.vegetarian && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">Vegetarian</span>}
                {filters.minRating === 4 && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">4+ Stars</span>}
              </div>
            </div>
          )}
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
