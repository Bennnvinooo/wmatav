
import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode } from '@/types/booking';
import UploadPage from '@/components/upload/UploadPage';
import BookingsDisplay from '@/components/bookings/BookingsDisplay';
import PageHeader from '@/components/layout/PageHeader';
import { useBookings } from '@/hooks/use-bookings';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getSampleData } from '@/utils/sample-data';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNav from '@/components/MobileNav';

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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log("Index page loaded, bookings:", bookings.length);
    
    // Add iOS specific viewport meta tag
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    }
  }, [bookings.length]);
  
  // State for toggling between calendar and list views
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Handler for upload button click
  const handleUploadClick = useCallback(() => {
    setShowUploadForm(true);
  }, [setShowUploadForm]);

  // Handler to view bookings
  const handleViewBookings = useCallback(() => {
    setShowUploadForm(false);
  }, [setShowUploadForm]);
  
  // Handler to load sample data
  const handleLoadSampleData = useCallback(() => {
    handleDataLoaded(getSampleData());
    toast({
      title: "Sample data loaded",
      description: "Sample booking data has been loaded successfully",
    });
  }, [handleDataLoaded, toast]);
  
  // Handler for refreshing data
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // Force reload the page to get fresh data
    window.location.reload();
  }, [setIsLoading]);

  return (
    <div className="container mx-auto py-4 px-4 mb-20 safe-area-inset">
      {showUploadForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">WMATA AV Booking</h1>
            {bookings.length > 0 && (
              <Button 
                variant="outline"
                onClick={handleViewBookings}
                className="py-6 px-4"
              >
                View Bookings
              </Button>
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
            onRefreshClick={handleRefresh}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">WMATA AV Booking</h1>
          <p className="text-gray-600 mb-6">AV Room Booking Information</p>
          
          <p className="text-lg mb-8">This is a public view of the WMATA room booking system. The data has not been uploaded yet.</p>
          
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button 
              onClick={handleRefresh}
              variant="default"
              className="py-6 text-base w-full"
            >
              Refresh Data
            </Button>
            
            <Button 
              onClick={handleLoadSampleData}
              variant="outline"
              className="py-6 text-base w-full"
            >
              Load Sample Data
            </Button>
            
            <Button 
              onClick={handleUploadClick}
              variant="outline"
              className="py-6 text-base w-full"
            >
              Upload Data
            </Button>
          </div>
          
          {isMobile && (
            <MobileNav 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
              onUploadClick={handleUploadClick}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
