
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
  
  // Force show upload form on initial load
  useEffect(() => {
    // Always show upload form by default
    setShowUploadForm(true);
    
    // Grant admin access
    try {
      localStorage.setItem('wmataAdminAccess', 'granted');
      console.log("Index: Admin access granted on load");
    } catch (error) {
      console.error("Error storing admin access:", error);
    }
  }, []);
  
  // State for toggling between calendar and list views
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Handler for upload button click
  const handleUploadClick = () => {
    setShowUploadForm(true);
    // Grant direct admin access for all users
    localStorage.setItem('wmataAdminAccess', 'granted');
    console.log("Admin access granted via upload button");
  };

  // Handler to view bookings
  const handleViewBookings = () => {
    setShowUploadForm(false);
  };

  return (
    <div className="container mx-auto py-4 px-4">
      {showUploadForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">WMATA AV Booking</h1>
            {bookings.length > 0 && (
              <Button onClick={handleViewBookings}>View Bookings</Button>
            )}
          </div>
          <UploadPage 
            handleDataLoaded={handleDataLoaded} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <PageHeader 
              lastUpdate={lastUpdate} 
              onUploadClick={handleUploadClick}
              bookings={bookings}
            />
          </div>
          
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
        </>
      )}
    </div>
  );
};

export default Index;
