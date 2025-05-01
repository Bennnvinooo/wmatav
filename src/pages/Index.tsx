
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
  const [isPublicMode, setIsPublicMode] = useState(false);
  
  // Check if we're in public mode
  useEffect(() => {
    const hostname = window.location.hostname;
    const isPublic = hostname === 'wmatav.lovable.app';
    setIsPublicMode(isPublic);
    
    // Show toast only once on initial load in public mode
    if (isPublic && bookings.length === 0) {
      toast({
        title: "Public View Mode",
        description: "Please login or check back when the administrator has uploaded data.",
        duration: 5000
      });
    }
  }, []);
  
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
            bookings={bookings}
          />
          
          {isPublicMode && bookings.length === 0 ? (
            <div className="mt-8 p-4 bg-muted rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-2">No booking data available</h2>
              <p className="mb-4">Please check back later when the administrator has uploaded data.</p>
              <Button onClick={handleUploadClick} className="mt-2">Admin Login</Button>
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

// Add Button component for local usage
const Button = React.forwardRef<
  HTMLButtonElement, 
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }
>(({ className = '', variant = 'default', ...props }, ref) => {
  const baseClass = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium";
  const variantClass = variant === 'default' 
    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  
  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export default Index;
