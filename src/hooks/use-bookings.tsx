
import { useEffect, useMemo, useState } from 'react';
import { RoomBooking } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';
import { useBookingsStore } from './use-bookings-store';
import { useBookingsPersistence } from './use-bookings-persistence';
import { useBookingsFiltering } from './use-bookings-filtering';

export function useBookings() {
  const {
    bookings,
    setBookings,
    isLoading,
    setIsLoading,
    showUploadForm,
    setShowUploadForm,
    filterOptions,
    setFilterOptions,
    clearFilters
  } = useBookingsStore();

  // State to track if data has been initialized
  const [isInitialized, setIsInitialized] = useState(false);

  const { saveBookingsToStorage, loadBookingsFromStorage } = useBookingsPersistence();
  const { filteredBookings } = useBookingsFiltering(bookings, filterOptions);
  const { toast } = useToast();
  
  const lastUpdate = useMemo(() => {
    const storedDate = localStorage.getItem('lastUpdate');
    if (storedDate) {
      try {
        return new Date(storedDate).toLocaleString();
      } catch (e) {
        // If parsing fails, return current date
        return new Date().toLocaleString();
      }
    }
    return new Date().toLocaleString();
  }, [bookings]);
  
  const handleDataLoaded = (data: RoomBooking[]) => {
    console.log("Data loaded:", data.length, "bookings");
    setBookings(data);
    setShowUploadForm(false);
    
    saveBookingsToStorage(data);
    clearFilters();
    
    toast({
      title: "Success",
      description: `Loaded ${data.length} bookings successfully`,
    });
  };
  
  // Load saved bookings from localStorage on initial load
  useEffect(() => {
    if (isInitialized) return; // Skip if already initialized
    
    console.log("useBookings: Initial load attempt");
    setIsLoading(true);
    
    try {
      // Try to load bookings from storage first
      const savedBookings = loadBookingsFromStorage();
      console.log("Loaded saved bookings:", savedBookings?.length || 0);
      
      if (savedBookings && savedBookings.length > 0) {
        setBookings(savedBookings);
        setShowUploadForm(false); // Make sure we show the bookings view
        console.log("Successfully loaded saved bookings");
      } else {
        // No saved bookings found
        setShowUploadForm(false); // Show empty state with options
        console.log("No saved bookings found, showing empty state");
      }
    } catch (e) {
      console.error("Error during initialization:", e);
      setShowUploadForm(false); // Show empty state with options
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
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
