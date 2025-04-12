import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DebugEnv() {
  const [showEnv, setShowEnv] = useState(false);
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowEnv(!showEnv)}
      >
        {showEnv ? "Hide Environment Info" : "Debug Environment"}
      </Button>
      
      {showEnv && (
        <div className="mt-2 text-xs bg-white p-2 rounded border">
          <div><strong>FIREBASE_API_KEY:</strong> {import.meta.env.VITE_FIREBASE_API_KEY || 'Not set'}</div>
          <div><strong>FIREBASE_PROJECT_ID:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not set'}</div>
          <div><strong>FIREBASE_APP_ID:</strong> {import.meta.env.VITE_FIREBASE_APP_ID || 'Not set'}</div>
          <div><strong>GOOGLE_MAPS_API_KEY:</strong> {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set (hidden)' : 'Not set'}</div>
        </div>
      )}
    </div>
  );
}