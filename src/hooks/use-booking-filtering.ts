
import { useState } from 'react';
import { FilterOptions, RoomBooking } from '@/types/booking';

export const useBookingFiltering = (bookings: RoomBooking[]) => {
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
  
  // Filter bookings based on filter options
  const filteredBookings = bookings.length > 0 
    ? bookings.filter(booking => {
        // Filter by room name
        if (filterOptions.roomName && booking.roomName !== filterOptions.roomName) {
          return false;
        }
        
        // Filter by date range
        if (filterOptions.dateRange.start && booking.date < filterOptions.dateRange.start) {
          return false;
        }
        if (filterOptions.dateRange.end && booking.date > filterOptions.dateRange.end) {
          return false;
        }
        
        // Filter by booker
        if (filterOptions.bookedBy && booking.bookedBy !== filterOptions.bookedBy) {
          return false;
        }
        
        // Filter by status
        if (filterOptions.status && filterOptions.status.length > 0 && !filterOptions.status.includes(booking.status)) {
          return false;
        }
        
        // Filter by search term
        if (filterOptions.searchTerm) {
          const searchTerm = filterOptions.searchTerm.toLowerCase();
          return (
            booking.roomName.toLowerCase().includes(searchTerm) ||
            booking.bookedBy.toLowerCase().includes(searchTerm) ||
            booking.purpose.toLowerCase().includes(searchTerm)
          );
        }
        
        return true;
      })
    : [];
  
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
    filterOptions,
    setFilterOptions,
    filteredBookings,
    clearFilters
  };
};
