
import React, { useState, useEffect } from 'react';
import { ViewMode } from '@/types/booking';
import UploadPage from '@/components/upload/UploadPage';
import BookingsDisplay from '@/components/bookings/BookingsDisplay';
import PageHeader from '@/components/layout/PageHeader';
import { useBookings } from '@/hooks/use-bookings';
import { useToast } from '@/hooks/use-toast';

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
  
  useEffect(() => {
    console.log("Index page loaded, bookings:", bookings.length);
    // Ensure we show bookings view by default
    setShowUploadForm(false);
  }, [bookings.length]);
  
  // State for toggling between calendar and list views
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Handler for upload button click
  const handleUploadClick = () => {
    setShowUploadForm(true);
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
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={handleViewBookings}
              >
                View Bookings
              </button>
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
