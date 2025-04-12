import { useLocation as useRouterLocation } from "wouter";
import { useLocation } from "@/hooks/useLocation";

export default function LocationBar() {
  const { location, setShowLocationModal } = useLocation();
  const [, navigate] = useRouterLocation();

  const handleChangeLocation = () => {
    setShowLocationModal(true);
  };

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary mr-2"
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
          <span>{location?.address || "Set your location"}</span>
          <button className="ml-auto text-secondary" onClick={handleChangeLocation}>
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
