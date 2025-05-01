
import { useMemo } from 'react';
import { RoomBooking, FilterOptions } from '@/types/booking';

export function useBookingsFiltering(bookings: RoomBooking[], filterOptions: FilterOptions) {
  const filteredBookings = useMemo(() => {
    if (bookings.length === 0) return [];
    
    console.log("Filtering bookings with options:", filterOptions);
    
    return bookings.filter(booking => {
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
    });
  }, [bookings, filterOptions]);

  return { filteredBookings };
}
