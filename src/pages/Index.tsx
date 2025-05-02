
import React, { useState, useEffect } from 'react';
import { ViewMode } from '@/types/booking';
import UploadPage from '@/components/upload/UploadPage';
import BookingsDisplay from '@/components/bookings/BookingsDisplay';
import PageHeader from '@/components/layout/PageHeader';
import { useBookings } from '@/hooks/use-bookings';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getSampleData } from '@/utils/sample-data';

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
  
  // Handler to load sample data
  const handleLoadSampleData = () => {
    handleDataLoaded(getSampleData());
    toast({
      title: "Sample data loaded",
      description: "Sample booking data has been loaded successfully",
    });
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
      ) : bookings.length > 0 ? (
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
            onUploadClick={handleUploadClick}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-3xl font-bold mb-2">WMATA AV Booking</h1>
          <p className="text-gray-600 mb-8">AV Room Booking Information</p>
          
          <p className="text-lg mb-6">This is a public view of the WMATA room booking system. The data has not been uploaded yet.</p>
          
          <div className="space-x-4">
            <Button 
              onClick={handleLoadSampleData}
              variant="default"
            >
              Load Sample Data
            </Button>
            
            <Button 
              onClick={handleUploadClick}
              variant="outline"
            >
              Upload Data
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
