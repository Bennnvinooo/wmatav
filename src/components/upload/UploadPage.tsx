
import React from 'react';
import { RoomBooking } from '@/types/booking';
import FileUpload from '@/components/FileUpload';
import { UploadSkeleton } from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';

interface UploadPageProps {
  handleDataLoaded: (data: RoomBooking[]) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ 
  handleDataLoaded, 
  isLoading, 
  setIsLoading 
}) => {
  // Check if we're running in public mode (on wmatav.lovable.app)
  const isPublicMode = window.location.hostname === 'wmatav.lovable.app';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Room Booking Display System</h1>
        <p className="text-center text-muted-foreground">
          {isPublicMode 
            ? "AV Room Booking Information" 
            : "Upload an Excel file containing your room booking information"}
        </p>
      </div>
      
      {isLoading ? <UploadSkeleton /> : (
        isPublicMode ? (
          <div className="text-center">
            <p className="mb-4">This is a public view of the room booking system.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mx-auto"
            >
              Refresh Data
            </Button>
          </div>
        ) : (
          <FileUpload 
            onDataLoaded={handleDataLoaded} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )
      )}
    </div>
  );
};

export default UploadPage;
