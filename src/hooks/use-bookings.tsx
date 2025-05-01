
import { useState, useEffect, useMemo } from 'react';
import { RoomBooking } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';
import { useBookingFiltering } from './use-booking-filtering';
import { loadBookings, saveBookings, isPublicMode } from '@/utils/storage';

export function useBookings() {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { toast } = useToast();
  
  // Use our extracted filtering hook
  const {
    filterOptions,
    setFilterOptions,
    filteredBookings,
    clearFilters
  } = useBookingFiltering(bookings);
  
  // Track last update time
  const lastUpdate = useMemo(() => {
    return new Date().toLocaleString();
  }, [bookings]);
  
  const handleDataLoaded = (data: RoomBooking[]) => {
    console.log("Data loaded:", data.length, "bookings");
    setBookings(data);
    setShowUploadForm(false);
    
    // Save bookings to storage
    saveBookings(data);
    
    // Clear filters
    clearFilters();
    
    toast({
      title: "Data loaded successfully",
      description: `${data.length} bookings loaded and saved for future access`,
    });
  };
  
  // Load saved bookings from storage on initial load
  useEffect(() => {
    setIsLoading(true);
    
    // First, check if we're on the public domain
    const publicMode = isPublicMode();
    console.log("Is public mode:", publicMode);
    
    // Try to load bookings from storage
    const savedBookingsData = loadBookings();
    const foundBookings = savedBookingsData !== null;
    
    if (foundBookings) {
      setBookings(savedBookingsData!.bookings);
      
      if (!publicMode) {
        toast({
          title: "Loaded saved data",
          description: `${savedBookingsData!.bookings.length} bookings loaded from your last session`,
        });
      }
    } else if (publicMode) {
      // In public mode with no saved data, show an empty state
      console.log("No saved bookings found in public mode");
      setBookings([]);
      toast({
        title: "No booking data available",
        description: "Please check back later when the administrator has uploaded data.",
        variant: "destructive"
      });
    }
    
    // In admin mode, show upload form if no data was found
    // In public mode, never show upload form
    setShowUploadForm(!publicMode && !foundBookings);
    
    setIsLoading(false);
  }, []);

  return {
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
  };
}
