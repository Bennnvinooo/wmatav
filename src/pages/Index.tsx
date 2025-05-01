
import React, { useState, useEffect } from 'react';
import { ViewMode } from '@/types/booking';
import UploadPage from '@/components/upload/UploadPage';
import BookingsDisplay from '@/components/bookings/BookingsDisplay';
import PageHeader from '@/components/layout/PageHeader';
import { useBookings } from '@/hooks/use-bookings';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';

const Index: React.FC = () => {
  // Get bookings and related state from our custom hook
  const {
    bookings,
    filteredBookings,
    isLoading,
    setIsLoading,
    showUploadForm,
    setShowUploadForm,
    filterOptions,
    setFilterOptions,
    lastUpdate,
    handleDataLoaded,
    clearFilters
  } = useBookings();
  
  const { toast } = useToast();
  const [isPublicMode, setIsPublicMode] = useState(false);
  
  // Simplified hostname check to fix preview issues
  useEffect(() => {
    try {
      // For testing in preview, default to admin mode
      const hostname = window.location.hostname;
      console.log("Current hostname:", hostname);
      
      // Simpler check - only set public mode for specific domains
      const isPublic = hostname === 'wmatav.lovable.app';
      setIsPublicMode(isPublic);
      console.log("Is public mode:", isPublic);
      
      if (isPublic && bookings.length === 0) {
        toast({
          title: "Public View Mode",
          description: "Please login or check back when the administrator has uploaded data.",
          duration: 5000
        });
      }
    } catch (error) {
      console.error("Error checking hostname:", error);
      // Default to admin mode if there's an error
      setIsPublicMode(false);
    }
  }, []);
  
  // State for toggling between calendar and list views
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Handler for upload button click
  const handleUploadClick = () => {
    setShowUploadForm(true);
    // Grant direct admin access for admin users
    localStorage.setItem('wmataAdminAccess', 'granted');
    console.log("Admin access granted via upload button");
  };

  // Handler for admin login click
  const handleAdminLoginClick = () => {
    setShowUploadForm(true);
    // Grant admin access when clicking admin login
    localStorage.setItem('wmataAdminAccess', 'granted');
    console.log("Admin access granted via admin login");
  };

  // Always visible admin button  
  const renderAdminButton = () => {
    return (
      <Button
        onClick={handleAdminLoginClick}
        variant="outline"
        size="sm"
        className="ml-auto"
      >
        <LockKeyhole className="mr-2 h-4 w-4" />
        Admin Mode
      </Button>
    );
  };

  return (
    <div className="container mx-auto py-4 px-4">
      {showUploadForm ? (
        <UploadPage 
          handleDataLoaded={handleDataLoaded} 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <PageHeader 
              lastUpdate={lastUpdate} 
              onUploadClick={handleUploadClick}
              bookings={bookings}
              isPublicMode={isPublicMode}
            />
            {renderAdminButton()}
          </div>
          
          {isPublicMode && bookings.length === 0 ? (
            <div className="mt-8 p-8 bg-muted rounded-lg text-center shadow-sm border border-border">
              <h2 className="text-2xl font-semibold mb-4">No booking data available</h2>
              <p className="mb-6 text-muted-foreground">Please check back later when the administrator has uploaded data.</p>
              <Button 
                onClick={handleAdminLoginClick} 
                size="lg"
                className="font-medium"
              >
                Admin Login
              </Button>
            </div>
          ) : (
            <BookingsDisplay 
              bookings={bookings}
              filteredBookings={filteredBookings}
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              viewMode={viewMode}
              setViewMode={setViewMode}
              isLoading={isLoading}
              clearFilters={clearFilters}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
