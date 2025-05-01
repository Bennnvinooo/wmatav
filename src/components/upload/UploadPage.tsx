
import React from 'react';
import { RoomBooking } from '@/types/booking';
import FileUpload from '@/components/FileUpload';
import { UploadSkeleton } from '@/components/SkeletonLoader';
import PageHeader from './PageHeader';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // Simple notification when component mounts
  React.useEffect(() => {
    toast({
      title: "Ready to Upload",
      description: "You can now upload your Excel file."
    });
  }, [toast]);

  return (
    <div className="container mx-auto py-4">
      <PageHeader />
      
      {isLoading ? (
        <UploadSkeleton />
      ) : (
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
