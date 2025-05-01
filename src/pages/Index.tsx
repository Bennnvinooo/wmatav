
import React, { useState } from 'react';
import { ViewMode } from '@/types/booking';
import UploadPage from '@/components/upload/UploadPage';
import BookingsDisplay from '@/components/bookings/BookingsDisplay';
import PageHeader from '@/components/layout/PageHeader';
import { useBookings } from '@/hooks/use-bookings';

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
  
  // State for toggling between calendar and list views
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Handler for upload button click
  const handleUploadClick = () => {
    setShowUploadForm(true);
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
          <PageHeader 
            lastUpdate={lastUpdate} 
            onUploadClick={handleUploadClick}
          />
          
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
