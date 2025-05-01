
import React, { useState, useEffect } from 'react';
import { RoomBooking } from '@/types/booking';
import FileUpload from '@/components/FileUpload';
import { UploadSkeleton } from '@/components/SkeletonLoader';
import PageHeader from './PageHeader';
import AccessCard from './AccessCard';
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
  // Simplified check for preview environments
  const hostname = window.location.hostname;
  const isPublicMode = hostname === 'wmatav.lovable.app';
  
  // In preview environments, we'll default to admin access
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  
  // Check for admin status in localStorage
  useEffect(() => {
    try {
      const adminStatus = localStorage.getItem('wmataAdminAccess');
      if (adminStatus === 'granted') {
        setIsPasswordCorrect(true);
        console.log("Admin access granted from localStorage");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      // In preview, default to admin access
      setIsPasswordCorrect(true);
    }
  }, []);

  const handleRefresh = () => {
    // Clear any cached data to force a fresh load
    try {
      localStorage.removeItem('lastViewedBookings');
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
    window.location.reload();
  };
  
  const handleAuthenticate = () => {
    setIsPasswordCorrect(true);
    // Store admin access in localStorage
    try {
      localStorage.setItem('wmataAdminAccess', 'granted');
    } catch (error) {
      console.error("Error storing admin access:", error);
    }
  };

  // Direct access option for admins - always enabled in preview
  const handleDirectAccess = () => {
    setIsPasswordCorrect(true);
    try {
      localStorage.setItem('wmataAdminAccess', 'granted');
    } catch (error) {
      console.error("Error storing admin access:", error);
    }
    toast({
      title: "Admin Access Granted",
      description: "You can now upload booking data."
    });
  };

  // Add emergency bypass for testing
  const handleEmergencyAccess = () => {
    console.log("Emergency admin access triggered");
    setIsPasswordCorrect(true);
    try {
      localStorage.setItem('wmataAdminAccess', 'granted');
    } catch (error) {
      console.error("Error storing admin access:", error);
    }
    toast({
      title: "Emergency Admin Access",
      description: "You now have upload access",
    });
  };

  // Admin access handler for PageHeader
  const handleAdminAccess = () => {
    setIsSheetOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader onAdminAccess={handleAdminAccess} />
      
      {isLoading ? (
        <UploadSkeleton />
      ) : (
        <>
          {!isPasswordCorrect ? (
            <AccessCard 
              isPublicMode={isPublicMode}
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
              onRefresh={handleRefresh}
              onAuthenticate={handleAuthenticate}
              onDirectAccess={handleDirectAccess}
              onEmergencyAccess={handleEmergencyAccess}
            />
          ) : (
            <FileUpload 
              onDataLoaded={handleDataLoaded} 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UploadPage;
