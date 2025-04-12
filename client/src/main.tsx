import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Declare global window interface
declare global {
  interface Window {
    initMap: () => void;
  }
}

// Load Google Maps script dynamically
const loadGoogleMapsScript = () => {
  const script = document.createElement("script");
  // Hardcode Google Maps API Key to avoid environment variable issues
  const googleMapsApiKey = "AIzaSyBoRd8cypQqd8tWw7OIPajdpDEmfVUVhXQ";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  
  // Global callback function
  window.initMap = () => {
    console.log("Google Maps API loaded");
  };
};

// Fire and forget
loadGoogleMapsScript();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
