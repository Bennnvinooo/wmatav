
import { useEffect, useMemo } from 'react';
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

  const { saveBookingsToStorage, loadBookingsFromStorage } = useBookingsPersistence();
  const { filteredBookings } = useBookingsFiltering(bookings, filterOptions);
  const { toast } = useToast();
  
  const lastUpdate = useMemo(() => {
    return new Date().toLocaleString();
  }, [bookings]);
  
  const handleDataLoaded = (data: RoomBooking[]) => {
    console.log("Data loaded:", data.length, "bookings");
    setBookings(data);
    setShowUploadForm(false);
    
    saveBookingsToStorage(data);
    clearFilters();
  };
  
  // Load saved bookings from localStorage on initial load
  useEffect(() => {
    console.log("useBookings: Initial load");
    
    // Try to load bookings from storage first
    const savedBookings = loadBookingsFromStorage();
    console.log("Loaded saved bookings:", savedBookings?.length || 0);
    
    if (savedBookings && savedBookings.length > 0) {
      setBookings(savedBookings);
    }
    
    // Default to showing bookings view
    setShowUploadForm(false);
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
