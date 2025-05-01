
import React, { useState, useEffect } from 'react';
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
  // Always grant admin access
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  
  // Automatically grant admin access on load
  useEffect(() => {
    try {
      localStorage.setItem('wmataAdminAccess', 'granted');
      console.log("UploadPage: Admin access automatically granted");
      toast({
        title: "Ready to Upload",
        description: "You can now upload your Excel file."
      });
    } catch (error) {
      console.error("Error setting admin access:", error);
    }
  }, []);

  // Admin access handler - directly open file dialog
  const handleAdminAccess = () => {
    console.log("Upload button clicked");
    
    // Find and click the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
      console.log("File input clicked");
    } else {
      console.error("File input not found");
      toast({
        title: "Error",
        description: "Upload function not available. Please refresh the page."
      });
    }
  };

  return (
    <div className="container mx-auto py-4">
      <PageHeader onAdminAccess={handleAdminAccess} />
      
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
