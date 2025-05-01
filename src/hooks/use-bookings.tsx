
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
  
  // Load saved bookings from localStorage or sessionStorage on initial load
  useEffect(() => {
    console.log("useBookings: Initial load");
    
    // Default to showing bookings by default
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
