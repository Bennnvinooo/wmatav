
import { useState } from 'react';
import { RoomBooking, FilterOptions } from '@/types/booking';
import { getSampleData } from '@/utils/sample-data';

// Hook to manage the bookings state
export function useBookingsStore() {
  const [bookings, setBookings] = useState<RoomBooking[]>(getSampleData());
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Initialize with empty filters
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    roomName: null,
    dateRange: {
      start: null,
      end: null
    },
    bookedBy: null,
    status: null,
    searchTerm: ''
  });

  const clearFilters = () => {
    setFilterOptions({
      roomName: null,
      dateRange: { start: null, end: null },
      bookedBy: null,
      status: null,
      searchTerm: ''
    });
  };

  return {
    bookings,
    setBookings,
    isLoading,
    setIsLoading,
    showUploadForm,
    setShowUploadForm,
    filterOptions,
    setFilterOptions,
    clearFilters
  };
}
