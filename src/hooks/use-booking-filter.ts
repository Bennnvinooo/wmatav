
import { useMemo } from 'react';
import { RoomBooking, FilterOptions } from '@/types/booking';
import { isSameDay, isWithinInterval } from 'date-fns';

export const useBookingFilter = (bookings: RoomBooking[], dateRange: { start: Date, end: Date }) => {
  // Filter bookings for the current view
  const visibleBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (!booking.date) return false; // Skip bookings with invalid dates
      
      try {
        // Safely parse the date string
        const dateStr = booking.date;
        // Assuming date is in YYYY-MM-DD format
        const parts = dateStr.split('-');
        if (parts.length !== 3) return false;
        
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
        const day = parseInt(parts[2], 10);
        
        if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
        
        const bookingDate = new Date(year, month, day);
        
        return isWithinInterval(bookingDate, {
          start: dateRange.start,
          end: dateRange.end
        });
      } catch (error) {
        console.error("Error parsing date:", booking.date, error);
        return false;
      }
    });
  }, [bookings, dateRange]);

  // Get bookings for a specific day
  const getDayBookings = (date: Date) => {
    return visibleBookings.filter(booking => {
      if (!booking.date) return false;
      
      try {
        // Safely parse the booking date
        const parts = booking.date.split('-');
        if (parts.length !== 3) return false;
        
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
        const day = parseInt(parts[2], 10);
        
        if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
        
        const bookingDate = new Date(year, month, day);
        return isSameDay(bookingDate, date);
      } catch (error) {
        console.error("Error comparing dates:", booking.date, error);
        return false;
      }
    }).sort((a, b) => {
      // Sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
  };

  return {
    visibleBookings,
    getDayBookings
  };
};
