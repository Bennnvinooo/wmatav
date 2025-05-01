
import React from 'react';
import { RoomBooking } from '@/types/booking';
import FileUpload from '@/components/FileUpload';
import { UploadSkeleton } from '@/components/SkeletonLoader';

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
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Room Booking Display System</h1>
        <p className="text-center text-muted-foreground">Upload an Excel file containing your room booking information</p>
      </div>
      
      {isLoading ? <UploadSkeleton /> : (
        <FileUpload 
          onDataLoaded={handleDataLoaded} 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default UploadPage;
